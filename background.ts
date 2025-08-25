let statusUpdatePort: chrome.runtime.Port | null = null;

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "loading-status") {
    statusUpdatePort = port;
    console.log("백그라운드: popup과 포트 연결 성공.");

    port.onMessage.addListener(async (message) => {
      if (message.type === "showMap") {
        console.log(`백그라운드: 포트를 통해 ${message.type} 이벤트 수신.`);
        
        // 저장된 이전 작업 시간을 불러와 popup에 전달
        const result = await chrome.storage.local.get("lastRequestDuration");
        const estimatedDuration = result.lastRequestDuration || 8000; // 기본값 8초
        port.postMessage({ status: "starting", estimatedDuration });

        processAndShowMap(message.url, message.jwtToken, message.tokenType);
      }
    });

    port.onDisconnect.addListener(() => {
      statusUpdatePort = null;
      console.log("백그라운드: popup과 포트 연결 끊김.");
    });
  }
});

const API_BASE_URL = "http://localhost:8000";
const WEB_MAP_BASE_URL = "http://localhost:3000";

// 서버의 기술적인 메시지를 사용자 친화적인 메시지로 변환
function getFriendlyMessage(serverMessage: string, progress: number): string {
  if (!serverMessage) {
    return "영상을 분석하고 있습니다...";
  }
  
  const message = serverMessage.toLowerCase();
  
  // 진행률에 따른 기본 메시지
  if (progress < 20) {
    return "영상 정보를 확인하고 있습니다...";
  } else if (progress < 40) {
    return "영상 내용을 분석하고 있습니다...";
  } else if (progress < 70) {
    return "장소 정보를 찾고 있습니다...";
  } else if (progress < 90) {
    return "지도에 마커 표시 중...";
  } else {
    return "분석을 완료하고 있습니다...";
  }
}

async function processAndShowMap(youtubeUrl: string, jwtToken: string, tokenType: string) {
  const startTime = Date.now();
  
  console.log('[PIND_DEBUG] processAndShowMap started with:', {
    youtubeUrl: youtubeUrl,
    hasJwtToken: !!jwtToken,
    jwtTokenLength: jwtToken?.length,
    tokenType: tokenType
  });
  
  try {
    statusUpdatePort?.postMessage({ status: "extracting" });

    const apiUrl = `${API_BASE_URL}/api/v1/youtube/process`;
    const headers: HeadersInit = { 
      "Content-Type": "application/json",
      "Authorization": `${tokenType} ${jwtToken}`
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ url: youtubeUrl }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || `백엔드 서버 오류: ${response.statusText}`);
    }

    statusUpdatePort?.postMessage({ status: "mapping" });

    const locations = data;
    const locationsData = JSON.stringify(locations);
    // 로그인된 사용자는 dashboard로 이동
    let finalUrl = `${WEB_MAP_BASE_URL}/dashboard?locations=${encodeURIComponent(locationsData)}`;

    const storedData = await chrome.storage.local.get('userEmail');
    const userEmail = storedData.userEmail || 'unknown@example.com';
    
    console.log('[PIND_DEBUG] Before URL construction:', {
      hasJwtToken: !!jwtToken,
      jwtTokenLength: jwtToken?.length,
      tokenType: tokenType,
      userEmail: userEmail,
      locations: locations
    });
    
    finalUrl += `&token=${encodeURIComponent(jwtToken)}&token_type=${encodeURIComponent(tokenType)}&user_email=${encodeURIComponent(userEmail)}&auto_login=true&source=extension`;
    
    console.log('[PIND_DEBUG] Final URL parts:', {
      jwtTokenFirst10: jwtToken.substring(0, 10),
      jwtTokenLast10: jwtToken.substring(jwtToken.length - 10),
      encodedToken: encodeURIComponent(jwtToken).substring(0, 50) + '...',
      tokenType: tokenType,
      userEmail: userEmail
    });
    console.log('[PIND_PLASMO] Creating dashboard URL with auth:', finalUrl);
    console.log('[PIND_PLASMO] URL components:', {
      baseUrl: `${WEB_MAP_BASE_URL}/dashboard`,
      hasLocations: !!locations,
      hasToken: !!jwtToken,
      userEmail: userEmail
    });

    // 분석 결과를 저장하고 팝업에 알림 (바로 웹 맵 열지 않음)
    await chrome.storage.local.set({ 
      analysisResult: finalUrl,
      analysisStatus: "completed",
      analysisMessage: "Analysis complete!"
    });
    statusUpdatePort?.postMessage({ status: "complete" });

  } catch (error) {
    console.error("백그라운드 처리 중 오류 발생:", error);
    const errorMessage = error instanceof Error ? error.message : "장소 추출 중 오류가 발생했습니다.";
    
    // Storage에 오류 상태 저장
    await chrome.storage.local.set({ 
      analysisStatus: "error",
      analysisMessage: "An error occurred during analysis. Please try again later."
    });
    
    statusUpdatePort?.postMessage({ status: "error", message: errorMessage });
    chrome.notifications.create({
      type: "basic",
      iconUrl: chrome.runtime.getURL("assets/icon.png"),
      title: "Pind 처리 오류",
      message: errorMessage
    });
  } finally {
    // 작업 소요 시간을 측정하여 저장
    const endTime = Date.now();
    const duration = endTime - startTime;
    await chrome.storage.local.set({ lastRequestDuration: duration });
    console.log(`이번 작업 소요 시간: ${duration}ms`);
  }
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "handleIconClick") {
    console.log(`백그라운드: ${message.type} 이벤트 수신. URL 저장 후 팝업 실행.`);
    (async () => {
      const dataToStore = { 
        pendingUrl: message.url,
        youtubeTabId: sender.tab?.id 
      };
      console.log("백그라운드: 세션에 저장할 데이터", dataToStore);
      await chrome.storage.session.set(dataToStore);
      console.log("백그라운드: 세션 저장 완료");
      
      // 로그인 상태 확인
      const { jwtToken, tokenType } = await chrome.storage.local.get(['jwtToken', 'tokenType']);
      
      console.log("백그라운드: 토큰 상태 확인", { hasJwtToken: !!jwtToken, hasTokenType: !!tokenType });
      
      if (jwtToken && tokenType) {
        // 로그인된 사용자: 자동으로 분석 시작
        console.log("백그라운드: 로그인된 사용자 - 자동 분석 시작", { url: message.url });
        
        // 분석 상태를 storage에 저장
        await chrome.storage.local.set({ 
          analysisStatus: "analyzing",
          analysisMessage: "영상 속 장소를 추출하고 있습니다..."
        });
        
        // 팝업 열기
        chrome.action.openPopup();
        
        // 잠시 후 분석 시작
        setTimeout(() => {
          console.log("백그라운드: setTimeout 실행됨 - processAndShowMap 호출", { 
            url: message.url, 
            hasToken: !!jwtToken, 
            jwtTokenLength: jwtToken?.length,
            tokenType 
          });
          processAndShowMap(message.url, jwtToken, tokenType);
        }, 500);
        
        sendResponse({ status: "analysis_started" });
      } else {
        // 비로그인 사용자: 팝업만 열기
        console.log("백그라운드: 비로그인 사용자 - 팝업만 열기");
        chrome.action.openPopup();
        sendResponse({ status: "popup_opened" });
      }
    })();
    return true;
  } else if (message.type === "startProcessing") {
    console.log(`백그라운드: ${message.type} 이벤트 수신. 바로 처리 시작.`);
    (async () => {
      // popup에서 전달된 토큰을 우선 사용, 없으면 storage에서 가져오기
      let jwtToken = message.jwtToken;
      let tokenType = message.tokenType;
      
      if (!jwtToken || !tokenType) {
        const stored = await chrome.storage.local.get(['jwtToken', 'tokenType']);
        jwtToken = stored.jwtToken;
        tokenType = stored.tokenType;
      }
      
      console.log('[PIND_DEBUG] startProcessing with tokens:', {
        fromMessage: { hasToken: !!message.jwtToken, hasType: !!message.tokenType },
        finalTokens: { hasJwtToken: !!jwtToken, jwtTokenLength: jwtToken?.length, tokenType: tokenType }
      });
      
      processAndShowMap(message.url, jwtToken, tokenType);
      sendResponse({ status: "processing_started" });
    })();
    return true;
  }
});

const AUTH_CALLBACK_URL = "http://localhost:3000/auth/callback";

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  console.log(`백그라운드: 탭 업데이트 감지 - tabId: ${tabId}, status: ${changeInfo.status}, url: ${tab.url}`);
  
  if (changeInfo.status === 'complete' && tab.url?.startsWith(AUTH_CALLBACK_URL)) {
    console.log("백그라운드: 콜백 URL 감지됨!", tab.url);
    try {
      const url = new URL(tab.url);
      const params = new URLSearchParams(url.search);
      const jwtToken = params.get('token');
      const tokenType = params.get('token_type');
      const userEmail = params.get('user_email'); // Assuming email is also passed

      console.log("백그라운드: 토큰 파라미터 파싱 결과", { jwtToken: !!jwtToken, tokenType, userEmail });

      if (jwtToken && tokenType) {
        await chrome.storage.local.set({
          jwtToken: jwtToken,
          tokenType: tokenType,
          userEmail: userEmail || '' // Save email if provided
        });
        console.log("백그라운드: 토큰 저장 성공!");

        // Close the login tab
        chrome.tabs.remove(tabId);

        // Get stored YouTube tab ID and return to it
        const { youtubeTabId, pendingUrl } = await chrome.storage.session.get(['youtubeTabId', 'pendingUrl']);
        console.log("백그라운드: 저장된 데이터 확인", { youtubeTabId, pendingUrl: !!pendingUrl });
        
        if (youtubeTabId) {
          try {
            // Check if the tab still exists
            const youtubeTab = await chrome.tabs.get(youtubeTabId);
            if (youtubeTab) {
              // Switch to the YouTube tab
              chrome.tabs.update(youtubeTabId, { active: true });
              chrome.windows.update(youtubeTab.windowId, { focused: true });
              
              // Notify the YouTube tab about login success
              chrome.tabs.sendMessage(youtubeTabId, {
                type: "loginSuccess",
                jwtToken: jwtToken,
                tokenType: tokenType
              });

              // 로그인 성공 후 자동으로 분석 시작
              if (pendingUrl) {
                console.log("백그라운드: 로그인 성공 후 자동 분석 시작", { pendingUrl, jwtToken: !!jwtToken, tokenType });
                
                // 분석 상태를 storage에 저장
                await chrome.storage.local.set({ 
                  analysisStatus: "analyzing",
                  analysisMessage: "영상 속 장소를 추출하고 있습니다..."
                });
                console.log("백그라운드: 분석 상태 저장 완료");
                
                // 팝업을 열어서 로딩 UI 표시
                chrome.action.openPopup();
                console.log("백그라운드: 팝업 열기 요청 완료");
                
                // 잠시 후 분석 시작
                setTimeout(() => {
                  console.log("백그라운드: setTimeout 실행됨 - 분석 함수 호출 시작");
                  processAndShowMap(pendingUrl, jwtToken, tokenType);
                }, 500);
                console.log("백그라운드: setTimeout 설정 완료");
              } else {
                console.log("백그라운드: pendingUrl이 없음 - 자동 분석 건너뜀");
              }
            }
          } catch (error) {
            console.log("백그라운드: YouTube 탭이 더 이상 존재하지 않습니다.", error);
          }
        } else {
          console.log("백그라운드: youtubeTabId가 없습니다.");
        }

        // Optional: Notify the user of success
        chrome.notifications.create({
          type: "basic",
          iconUrl: chrome.runtime.getURL("assets/icon.png"),
          title: "로그인 성공",
          message: "Pind에 성공적으로 로그인되었습니다."
        });

      }
    } catch (error) {
      console.error("백그라운드: 토큰 처리 중 오류 발생:", error);
      chrome.notifications.create({
        type: "basic",
        iconUrl: chrome.runtime.getURL("assets/icon.png"),
        title: "로그인 오류",
        message: "로그인 처리 중 오류가 발생했습니다."
      });
    }
  }
});
