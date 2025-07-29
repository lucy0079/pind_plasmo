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

    // 로그인 상태 확인
    const checkLoginStatus = async () => {
      const result = await chrome.storage.local.get('jwtToken');
      const loggedIn = !!result.jwtToken;
      setIsLoggedIn(loggedIn);

      // 로그인되어 있지 않으면 로그인 모달을 바로 띄웁니다.
      if (!loggedIn) {
        setShowLoginModal(true);
      }
    };
    checkLoginStatus();
  }, [])

  const handleButtonClick = async () => {
    if (isLoggedIn) {
      setMessage("백그라운드에 지도 표시를 요청합니다...")

      // chrome.storage.local에서 토큰 정보 가져오기
      const result = await chrome.storage.local.get(['jwtToken', 'tokenType']);
      const jwtToken = result.jwtToken;
      const tokenType = result.tokenType;

      if (jwtToken && tokenType) {
        // 백그라운드 스크립트에 메시지를 보냅니다. 토큰 정보 포함
        chrome.runtime.sendMessage({ type: "showMap", url: url, jwtToken: jwtToken, tokenType: tokenType }, (response) => {
          // 메시지 전송 후 콜백 (필요 시 사용)
          if (chrome.runtime.lastError) {
            setMessage(`오류: ${chrome.runtime.lastError.message}`)
          } else {
            setMessage("요청이 성공적으로 전송되었습니다!")
          }
        })
      } else {
        setMessage("오류: 로그인 토큰을 찾을 수 없습니다. 다시 로그인해주세요.");
        setShowLoginModal(true); // 토큰이 없으면 로그인 모달 다시 띄우기
      }
    } else {
      // 이 경우는 isLoggedIn이 false일 때 버튼을 누른 것이므로, 이미 모달이 떠있거나
      // 모달을 다시 띄우는 로직이 필요할 수 있지만, 현재는 useEffect에서 처리하므로 불필요。
      // setShowLoginModal(true);
    }
  }

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
        isLoggedIn ? (
          <button onClick={handleButtonClick}>
            영상 속 장소 지도 보기
          </button>
        ) : (
          <button onClick={handleButtonClick}>
            로그인 / 회원가입
          </button>
        )
      ) : (
        <p className="warning-message">이 페이지는 유튜브 영상 페이지가 아닙니다.</p>
      )}

      {message && <p className="status-message">{message}</p>}

      {showLoginModal && (
        <Login onClose={() => setShowLoginModal(false)} onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  )
}

export default IndexPopup