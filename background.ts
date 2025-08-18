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

async function processAndShowMap(youtubeUrl: string, jwtToken?: string, tokenType?: string) {
  const startTime = Date.now();
  
  try {
    statusUpdatePort?.postMessage({ status: "extracting" });

    let apiUrl = `${API_BASE_URL}/api/v1/youtube/process`;
    const headers: HeadersInit = { "Content-Type": "application/json" };

    if (jwtToken && tokenType) {
      headers["Authorization"] = `${tokenType} ${jwtToken}`;
    } else {
      apiUrl = `${API_BASE_URL}/api/v1/youtube/without-login/process`;
    }

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

    if (jwtToken && tokenType) {
      const storedData = await chrome.storage.local.get('userEmail');
      const userEmail = storedData.userEmail || 'unknown@example.com'; // 저장된 이메일 사용 또는 기본값
      const userInfo = { email: userEmail };
      finalUrl += `&token=${encodeURIComponent(jwtToken)}&user_info=${encodeURIComponent(JSON.stringify(userInfo))}`;
      console.log('[PIND_PLASMO] Token found, creating URL with auth:', finalUrl);
    } else {
      console.log('[PIND_PLASMO] No token found, creating URL without auth:', finalUrl);
    }

    chrome.tabs.create({ url: finalUrl });

    statusUpdatePort?.postMessage({ status: "complete" });

  } catch (error) {
    console.error("백그라운드 처리 중 오류 발생:", error);
    const errorMessage = error instanceof Error ? error.message : "장소 추출 중 알 수 없는 오류가 발생했습니다.";
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
      await chrome.storage.session.set({ pendingUrl: message.url });
      chrome.action.openPopup();
      sendResponse({ status: "popup_opened" });
    })();
    return true;
  }
});

const AUTH_CALLBACK_URL = "http://localhost:3000/auth/callback";

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.startsWith(AUTH_CALLBACK_URL)) {
    try {
      const url = new URL(tab.url);
      const params = new URLSearchParams(url.search);
      const jwtToken = params.get('token');
      const tokenType = params.get('token_type');
      const userEmail = params.get('user_email'); // Assuming email is also passed

      if (jwtToken && tokenType) {
        await chrome.storage.local.set({
          jwtToken: jwtToken,
          tokenType: tokenType,
          userEmail: userEmail || '' // Save email if provided
        });
        console.log("백그라운드: 토큰 저장 성공!");

        // Close the login tab
        chrome.tabs.remove(tabId);

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
