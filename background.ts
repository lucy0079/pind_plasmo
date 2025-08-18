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
    let finalUrl = `${WEB_MAP_BASE_URL}?locations=${encodeURIComponent(locationsData)}`;

    const storedData = await chrome.storage.local.get('userEmail');
    const userEmail = storedData.userEmail || 'unknown@example.com';
    finalUrl += `&token=${encodeURIComponent(jwtToken)}&token_type=${encodeURIComponent(tokenType)}&user_email=${encodeURIComponent(userEmail)}`;
    console.log('[PIND_PLASMO] Creating URL with auth:', finalUrl);

    // 분석 결과를 저장하고 팝업에 알림 (바로 웹 맵 열지 않음)
    await chrome.storage.local.set({ analysisResult: finalUrl });
    statusUpdatePort?.postMessage({ status: "complete" });

  } catch (error) {
    console.error("백그라운드 처리 중 오류 발생:", error);
    const errorMessage = error instanceof Error ? error.message : "장소 추출 중 오류가 발생했습니다.";
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

// 백그라운드 전용 분석 함수 (job 기반 API 사용)
async function processAndShowMapInBackground(youtubeUrl: string, jwtToken: string, tokenType: string, retryCount: number = 0) {
  const startTime = Date.now();
  const maxRetries = 2; // 최대 2회 재시도 (총 3회 시도)
  
  console.log(`🚀 processAndShowMapInBackground 함수 시작!`, { 
    youtubeUrl, 
    hasJwtToken: !!jwtToken, 
    tokenType, 
    retryCount,
    API_BASE_URL 
  });
  
  try {
    console.log(`백그라운드: 분석 시작 - Job 제출 (시도 ${retryCount + 1}/${maxRetries + 1})`);

    // Step 1: Job 제출
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

    const jobData = await response.json();

    if (!response.ok) {
      throw new Error(jobData.detail || `백엔드 서버 오류: ${response.statusText}`);
    }

    console.log("백그라운드: Job 제출 완료, job_id:", jobData.job_id);

    // Step 2: Job 폴링하여 결과 대기
    const result = await pollForJobCompletion(jobData.job_id);
    
    console.log("백그라운드: 분석 완료, 결과 저장 중");

    // Step 3: 결과를 이용해 웹 맵 URL 생성
    const locationsData = JSON.stringify(result.places || []);
    let finalUrl = `${WEB_MAP_BASE_URL}/dashboard?locations=${encodeURIComponent(locationsData)}`;

    const storedData = await chrome.storage.local.get('userEmail');
    const userEmail = storedData.userEmail || 'unknown@example.com';
    finalUrl += `&token=${encodeURIComponent(jwtToken)}&token_type=${encodeURIComponent(tokenType)}&user_email=${encodeURIComponent(userEmail)}`;
    console.log('[PIND_PLASMO] Creating URL with auth:', finalUrl);

    // 분석 결과를 저장하고 완료 상태로 변경
    await chrome.storage.local.set({ 
      analysisResult: finalUrl,
      analysisStatus: "completed",
      analysisMessage: "분석 완료! 지도를 확인하세요."
    });

    console.log("백그라운드: 분석 결과 저장 완료");
    console.log("백그라운드: 최종 생성된 URL:", finalUrl);

  } catch (error) {
    console.error(`백그라운드 분석 중 오류 발생 (시도 ${retryCount + 1}):`, error);
    const errorMessage = error instanceof Error ? error.message : "장소 추출 중 알 수 없는 오류가 발생했습니다.";
    
    // JWT 토큰 만료/무효화 확인
    const isAuthError = errorMessage.includes('Could not validate credentials') ||
                       errorMessage.includes('Unauthorized') ||
                       errorMessage.includes('401');
    
    if (isAuthError) {
      console.log("백그라운드: JWT 토큰 만료 감지 - 로그인 상태 초기화");
      // 만료된 토큰 제거
      await chrome.storage.local.remove(['jwtToken', 'tokenType', 'userEmail']);
      // 사용자에게 재로그인 안내 (진행률은 유지)
      await chrome.storage.local.set({ 
        analysisStatus: "error",
        analysisMessage: "로그인이 만료되었습니다. 다시 로그인해주세요."
      });
      return; // 재시도하지 않고 종료
    }
    
    // 재시도 가능한 오류인지 확인 (DB 연결 오류도 포함)
    const isRetryableError = errorMessage.includes('Event loop') || 
                           errorMessage.includes('RuntimeError') || 
                           errorMessage.includes('작업 처리 실패') ||
                           errorMessage.includes('TimeoutError') ||
                           errorMessage.includes('Database') ||
                           errorMessage.includes('connection') ||
                           errorMessage.includes('500');
    
    if (isRetryableError && retryCount < maxRetries) {
      console.log(`백그라운드: 재시도 가능한 오류, ${2 + retryCount}초 후 재시도 (${retryCount + 1}/${maxRetries})`);
      
      // 현재 진행률과 메시지 보존 (재시도는 백그라운드에서 조용히)
      const { analysisProgress: currentProgress, analysisMessage: currentMessage } = await chrome.storage.local.get(['analysisProgress', 'analysisMessage']);
      await chrome.storage.local.set({ 
        analysisStatus: "analyzing",
        // 메시지는 그대로 유지 (재시도 표시 안함)
        analysisMessage: currentMessage || "영상 속 장소를 추출하고 있습니다...",
        // 진행률은 현재 값 유지 (45%면 45%에서 멈춤)
        analysisProgress: currentProgress || 0
      });
      
      // 지연 후 재시도 (DB 연결 문제를 위해 더 긴 대기시간)
      const retryDelay = errorMessage.includes('TimeoutError') || errorMessage.includes('Database') 
        ? (5 + retryCount * 5) * 1000  // DB 오류: 5초, 10초, 15초
        : (2 + retryCount) * 1000;     // 기타 오류: 2초, 3초, 4초
      
      setTimeout(() => {
        processAndShowMapInBackground(youtubeUrl, jwtToken, tokenType, retryCount + 1);
      }, retryDelay);
      
      return; // 현재 함수 종료, setTimeout으로 재시도
    }
    
    // 최종 실패 또는 재시도 불가능한 오류 (진행률은 유지)
    console.error("백그라운드: 최종 분석 실패 또는 재시도 불가능한 오류");
    const { analysisProgress: currentProgress } = await chrome.storage.local.get('analysisProgress');
    await chrome.storage.local.set({ 
      analysisStatus: "error",
      analysisMessage: retryCount >= maxRetries ? 
        "잠시 후 다시 시도해주세요." : 
        errorMessage,
      // 진행률은 현재 값 유지
      analysisProgress: currentProgress || 0
    });
  } finally {
    // 작업 소요 시간을 측정하여 저장
    const endTime = Date.now();
    const duration = endTime - startTime;
    await chrome.storage.local.set({ lastRequestDuration: duration });
    console.log(`백그라운드 분석 소요 시간: ${duration}ms`);
  }
}

// Job 폴링 함수
async function pollForJobCompletion(jobId: string): Promise<any> {
  const pollInterval = 1000; // 1초마다 체크
  let retryCount = 0;
  
  while (true) {
    try {
      console.log(`백그라운드: Job 상태 확인 - ${jobId}`);
      
      const statusResponse = await fetch(`${API_BASE_URL}/api/v1/jobs/${jobId}/status`);
      
      if (!statusResponse.ok) {
        throw new Error(`HTTP ${statusResponse.status}: ${statusResponse.statusText}`);
      }
      
      const statusData = await statusResponse.json();
      
      console.log(`백그라운드: Job 상태 - ${statusData.status}, 진행률: ${statusData.progress}%`);
      
      // 서버 메시지를 사용자 친화적인 메시지로 변환
      const friendlyMessage = getFriendlyMessage(statusData.current_step, statusData.progress);
      
      // popup.tsx로 실시간 진행률과 메시지 전송
      if (statusUpdatePort) {
        statusUpdatePort.postMessage({
          type: "progress_update",
          progress: statusData.progress,
          message: friendlyMessage
        });
      }
      
      // Chrome storage에 진행률 저장 (백그라운드 분석에서 사용)
      await chrome.storage.local.set({ 
        analysisProgress: statusData.progress,
        analysisMessage: friendlyMessage
      });
      
      if (statusData.status === 'SUCCESS') {
        const resultResponse = await fetch(`${API_BASE_URL}/api/v1/jobs/${jobId}/result`);
        
        if (!resultResponse.ok) {
          throw new Error(`결과 조회 실패 - HTTP ${resultResponse.status}: ${resultResponse.statusText}`);
        }
        
        const resultData = await resultResponse.json();
        console.log("백그라운드: Job 완료, 결과 수신");
        return {
          places: resultData.places || [],
          video_title: resultData.video_title,
          video_thumbnail: resultData.video_thumbnail
        };
      } else if (statusData.status === 'FAILURE') {
        // 에러 상세 정보 가져오기
        try {
          const resultResponse = await fetch(`${API_BASE_URL}/api/v1/jobs/${jobId}/result`);
          const resultData = await resultResponse.json();
          const errorMessage = resultData.error_message || statusData.current_step || '알 수 없는 오류';
          throw new Error(`작업 처리 실패: ${errorMessage}`);
        } catch (resultError) {
          throw new Error(`작업 처리 실패: ${statusData.current_step || '알 수 없는 오류'}`);
        }
      }

      // 아직 처리 중이면 잠시 대기 후 다시 확인
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    } catch (error) {
      console.error('백그라운드: Job 폴링 중 오류:', error);
      
      // 작업 실패 메시지인 경우 즉시 오류 throw
      if (error instanceof Error && error.message.includes('작업 처리 실패')) {
        throw error;
      }
      
      // 500 서버 오류나 특정 오류 코드인 경우 재시도 제한
      if (error instanceof Error && (
        error.message.includes('500') || 
        error.message.includes('Event loop') ||
        error.message.includes('RuntimeError')
      )) {
        retryCount = (retryCount || 0) + 1;
        if (retryCount > 2) { // 폴링에서는 2회만 재시도
          console.error('백그라운드: Job 폴링 재시도 횟수 초과');
          throw new Error('작업 처리 실패');
        }
        console.log(`백그라운드: 서버 오류로 인한 폴링 재시도 ${retryCount}/2`);
        await new Promise(resolve => setTimeout(resolve, pollInterval * 2)); // 대기 시간 단축
        continue;
      }
      
      // 일반적인 네트워크 오류는 좀 더 오래 기다린 후 재시도
      console.log('백그라운드: 폴링 중 네트워크 오류, 재시도...', error);
      await new Promise(resolve => setTimeout(resolve, pollInterval * 2));
    }
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
          console.log("백그라운드: setTimeout 실행됨 - processAndShowMapInBackground 호출", { 
            url: message.url, 
            hasToken: !!jwtToken, 
            tokenType 
          });
          processAndShowMapInBackground(message.url, jwtToken, tokenType);
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
      const { jwtToken, tokenType } = await chrome.storage.local.get(['jwtToken', 'tokenType']);
      processAndShowMap(message.url, jwtToken, tokenType);
      sendResponse({ status: "processing_started" });
    })();
    return true;
  } else if (message.type === "startBackgroundAnalysis") {
    console.log(`백그라운드: ${message.type} 이벤트 수신. 팝업에서 요청한 백그라운드 분석 시작.`);
    (async () => {
      console.log("백그라운드: 팝업 요청으로 분석 시작", { 
        url: message.url, 
        hasToken: !!message.jwtToken, 
        tokenType: message.tokenType 
      });
      processAndShowMapInBackground(message.url, message.jwtToken, message.tokenType);
      sendResponse({ status: "background_analysis_started" });
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
                  processAndShowMapInBackground(pendingUrl, jwtToken, tokenType);
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
