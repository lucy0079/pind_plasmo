import { useState, useEffect } from "react"
import "~popup.css"
import Login from './login'; // login.tsx import

function IndexPopup() {
  const [url, setUrl] = useState<string | null>(null)
  const [message, setMessage] = useState<string>("")
  const [isYoutubeVideo, setIsYoutubeVideo] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    // 현재 활성화된 탭의 정보를 가져옵니다.
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0]
      if (currentTab?.url) {
        setUrl(currentTab.url)
        // 현재 페이지가 유튜브 영상 페이지인지 확인합니다.
        if (currentTab.url.includes("youtube.com/watch?v=")) {
          setIsYoutubeVideo(true)
        }
      }
    })

    // 로그인 상태 및 세션 확인
    const checkLoginAndSessionStatus = async () => {
      const sessionResult = await chrome.storage.session.get('hasSkippedLogin');
      if (sessionResult.hasSkippedLogin) {
        // 로그인 건너뛰기를 선택한 경우
        setIsLoggedIn(false); // 비로그인 상태로 유지
        setShowLoginModal(false); // 로그인 모달을 띄우지 않음
        return;
      }

      const localResult = await chrome.storage.local.get('jwtToken');
      const loggedIn = !!localResult.jwtToken;
      setIsLoggedIn(loggedIn);

      // 로그인되어 있지 않고, 건너뛰기도 선택하지 않은 경우에만 로그인 모달을 띄웁니다.
      if (!loggedIn) {
        setShowLoginModal(true);
      }
    };

    checkLoginAndSessionStatus();
  }, [])

  const handleButtonClick = async () => {
    // "영상 속 장소 지도 보기" 버튼 클릭 시, 항상 백그라운드에 "showMap" 메시지를 보냅니다.
    // 백그라운드 스크립트가 로그인 상태를 확인하고, 그에 따라 적절한 처리를 할 것입니다.
    setMessage("요청 처리 중...");
    chrome.runtime.sendMessage({ type: "showMap", url: url }, (response) => {
      if (chrome.runtime.lastError) {
        setMessage(`오류: ${chrome.runtime.lastError.message}`);
      } else {
        // 성공적으로 메시지가 전송되면, 팝업을 닫습니다.
        window.close();
      }
    });
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
    setMessage("로그인 성공!");
    // 로그인 성공 후 팝업 닫기
    window.close();
  };

  return (
    <div className="popup-container">
      <h1>Pind</h1>
      <p className="url-text">현재 URL: {url || "로딩 중..."}</p>
      
      {isYoutubeVideo ? (
        <button onClick={handleButtonClick}>
          영상 속 장소 지도 보기
        </button>
      ) : (
        <p className="warning-message">이 페이지는 유튜브 영상 페이지가 아닙니다.</p>
      )}

      {message && <p className="status-message">{message}</p>}

      {showLoginModal && (
        <Login
          url={url}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  )
}

export default IndexPopup