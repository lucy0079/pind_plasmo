// background.ts

// https://192.168.18.124:9000/ , https://172.20.10.4:9000/extract-ylocations
const API_BASE_URL = "http://localhost:8001";
// 개발 중인 pind-web-map의 주소
const WEB_MAP_BASE_URL = "http://localhost:5173";

// content.tsx 또는 popup.tsx로부터 메시지를 받기 위한 리스너
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 메시지 타입이 "showMap"일 때만 작동
  if (message.type === "showMap") {
    // 1. 메시지를 보낸 탭(유튜브 페이지)의 URL을 가져옵니다.
    const youtubeUrl = message.url;
    const jwtToken = message.jwtToken; // popup.tsx에서 전달받은 jwtToken
    const tokenType = message.tokenType; // popup.tsx에서 전달받은 tokenType

    if (!youtubeUrl || !youtubeUrl.includes("youtube.com/watch?v=")) {
      console.error("메시지를 보낸 탭에서 유튜브 영상 URL을 찾을 수 없습니다.");
      return false; // 오류 발생 시 응답하지 않음
    }
    
    if (!jwtToken || !tokenType) {
      console.error("백그라운드: JWT 토큰 또는 토큰 타입이 없습니다.");
      // 사용자에게 알림을 보낼 수도 있습니다.
      chrome.notifications.create({
        type: "basic",
        iconUrl: "assets/icon-128.png",
        title: "Pind 오류",
        message: "로그인 토큰이 없어 요청을 보낼 수 없습니다. 다시 로그인해주세요."
      });
      return false;
    }

    console.log("백그라운드: 유튜브 URL 감지 -", youtubeUrl);

    // 2. 비동기 작업을 위해 async 함수를 즉시 실행합니다.
    (async () => {
      try {
        // 3. FastAPI 백엔드 서버에 POST 요청을 보냅니다.
        console.log(`백그라운드: FastAPI 서버(${API_BASE_URL})에 장소 추출 요청...`);
        const response = await fetch(`${API_BASE_URL}/api/v1/youtube/process`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `${tokenType} ${jwtToken}` // Authorization 헤더 추가
          },
          body: JSON.stringify({ url: youtubeUrl }),
        });

        // 4. 응답 본문을 한 번만 읽어서 변수에 저장합니다.
        const data = await response.json();

        if (!response.ok) {
          // 실패 시, 이미 읽은 데이터에서 에러 메시지를 사용합니다.
          throw new Error(data.error || `백엔드 서버 오류: ${response.statusText}`);
        }

        const locations = data; // 성공 시, 저장된 데이터를 사용합니다.
        console.log("백그라운드: 서버로부터 장소 데이터 수신 완료", locations);

        // 6. React 웹 앱을 열고, 받은 JSON 데이터를 URL 파라미터로 전달합니다.
        const locationsData = JSON.stringify(locations);
        const finalUrl = `${WEB_MAP_BASE_URL}?locations=${encodeURIComponent(locationsData)}`;

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
    })();
    
    // 비동기적으로 응답할 것임을 Chrome에 알립니다.
    return true;
  } else if (message.type === "openPopup") {
    console.log("백그라운드: 팝업 열기 요청 수신.");
    chrome.action.openPopup(); // 확장 프로그램 팝업 열기
    return true;
  }
});
