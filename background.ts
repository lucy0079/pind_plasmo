// background.ts

// https://192.168.18.124:9000/ , https://172.20.10.4:9000/extract-ylocations
const API_BASE_URL = "http://localhost:9001";
// 개발 중인 pind-web-map의 주소
const WEB_MAP_BASE_URL = "http://localhost:5174";

async function processAndShowMap(youtubeUrl: string, jwtToken?: string, tokenType?: string) {
  console.log("백그라운드: processAndShowMap 함수 실행. URL:", youtubeUrl, "JWT:", jwtToken ? "있음" : "없음");
  try {
    let apiUrl = `${API_BASE_URL}/api/v1/youtube/process`;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (jwtToken && tokenType) {
      // 로그인 사용자
      headers["Authorization"] = `${tokenType} ${jwtToken}`;
      console.log(`백그라운드: 로그인 사용자용 FastAPI 서버(${apiUrl})에 장소 추출 요청...`);
      console.log("백그라운드: 요청 헤더 (로그인):");
      console.log(headers);
    } else {
      // 비로그인 사용자
      apiUrl = `${API_BASE_URL}/api/v1/youtube/without-login/process`;
      console.log(`백그라운드: 비로그인 사용자용 FastAPI 서버(${apiUrl})에 장소 추출 요청...`);
      console.log("백그라운드: 요청 헤더 (비로그인):");
      console.log(headers);
    }

    console.log("백그라운드: 서버로 fetch 요청 시작...");
    console.log("백그라운드: 요청 URL:", apiUrl);
    console.log("백그라운드: 요청 헤더:", headers);
    console.log("백그라운드: 요청 본문:", JSON.stringify({ url: youtubeUrl }));
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ url: youtubeUrl }),
    });
    console.log("백그라운드: fetch 응답 수신. 상태:", response.status, response.statusText);

    // 4. 응답 본문을 한 번만 읽어서 변수에 저장합니다.
    const data = await response.json();
    console.log("백그라운드: 응답 데이터:", data);

    if (!response.ok) {
      // 실패 시, 이미 읽은 데이터에서 에러 메시지를 사용합니다.
      throw new Error(data.detail || `백엔드 서버 오류: ${response.statusText}`);
    }

    const locations = data; // 성공 시, 저장된 데이터를 사용합니다.
    console.log("백그라운드: 서버로부터 장소 데이터 수신 완료", locations);

    // 6. React 웹 앱을 열고, 받은 JSON 데이터를 URL 파라미터로 전달합니다.
    const locationsData = JSON.stringify(locations);
    const finalUrl = `${WEB_MAP_BASE_URL}?locations=${encodeURIComponent(locationsData)}`;
    console.log("백그라운드: 최종 웹맵 URL:", finalUrl);

    chrome.tabs.create({ url: finalUrl });

  } catch (error) {
    console.error("백그라운드 처리 중 오류 발생:", error);
     // 사용자에게 오류를 알리는 데스크톱 알림을 표시합니다.
    chrome.notifications.create({
      type: "basic",
      iconUrl: "assets/icon-128.png", // 128x128 아이콘 경로
      title: "Pind 처리 오류",
      message: error instanceof Error ? error.message : "장소 추출 중 알 수 없는 오류가 발생했습니다."
    });
  }
}

// content.tsx 또는 popup.tsx로부터 메시지를 받기 위한 리스너
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "handleIconClick") {
    console.log("백그라운드: 아이콘 클릭 이벤트 수신. 상태 확인 시작...");
    const youtubeUrl = message.url;

    (async () => {
      const localData = await chrome.storage.local.get('jwtToken');
      const sessionData = await chrome.storage.session.get('hasSkippedLogin');

      const isLoggedIn = !!localData.jwtToken;
      const hasSkippedLogin = !!sessionData.hasSkippedLogin;

      if (isLoggedIn || hasSkippedLogin) {
        console.log("백그라운드: 로그인 또는 건너뛰기 상태 확인. 지도 표시 로직 실행...");
        console.log("백그라운드: handleIconClick - youtubeUrl:", youtubeUrl);
        const tokenData = await chrome.storage.local.get(['jwtToken', 'tokenType']);
        console.log("백그라운드: handleIconClick - tokenData:", tokenData);
        processAndShowMap(youtubeUrl, tokenData.jwtToken, tokenData.tokenType);

      } else {
        console.log("백그라운드: 로그인/건너뛰기 상태 없음. 팝업 열기 실행...");
        chrome.action.openPopup();
      }
    })();
    
    return true; // 비동기 응답
  }
});