import { useState, useEffect, useRef } from "react";
import "~popup.css";
import Login from "./login"; // login.tsx import
import LoadingIndicator from "./LoadingIndicator";

function IndexPopup() {
  const [url, setUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isYoutubeVideo, setIsYoutubeVideo] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [percentage, setPercentage] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const stopProgressTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startProgressTimer = (duration: number, limit = 90) => {
    stopProgressTimer();
    const intervalTime = duration / (limit * 1.1); // 90%까지 도달하는 시간을 예측 시간보다 약간 빠르게 설정
    intervalRef.current = setInterval(() => {
      setPercentage((prev) => {
        if (prev >= limit) {
          stopProgressTimer();
          return limit;
        }
        return prev + 1;
      });
    }, intervalTime);
  };

  const startProcessingPendingUrl = async (pendingUrl: string) => {
    setLoading(true);
    setLoadingMessage("요청 준비 중...");
    setPercentage(0);

    const localResult = await chrome.storage.local.get(['jwtToken', 'tokenType']);
    const port = chrome.runtime.connect({ name: "loading-status" });

    port.onMessage.addListener((msg) => {
      if (msg.status === "starting") {
        // 백그라운드에서 받은 예측 시간으로 타이머 시작
        startProgressTimer(msg.estimatedDuration, 90);
      } else if (msg.status === "extracting") {
        setLoadingMessage("장소 추출 중...");
      } else if (msg.status === "mapping") {
        stopProgressTimer();
        setPercentage(100);
        setTimeout(() => {
          setLoadingMessage("지도에 표시 중...");
          setPercentage(0);
          startProgressTimer(500, 95); // 2단계는 0.5초로 고정
        }, 300);
      } else if (msg.status === "complete") {
        stopProgressTimer();
        setPercentage(100);
        setTimeout(() => {
          setLoading(false);
          window.close();
        }, 500);
      } else if (msg.status === "error") {
        stopProgressTimer();
        setLoading(false);
        setMessage(msg.message);
      }
    });

    port.postMessage({
      type: "showMap",
      url: pendingUrl,
      jwtToken: localResult.jwtToken,
      tokenType: localResult.tokenType
    });

    await chrome.storage.session.remove('pendingUrl');
  };

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (currentTab?.url) {
        setUrl(currentTab.url);
        if (currentTab.url.includes("youtube.com/watch?v=")) {
          setIsYoutubeVideo(true);
        }
      }
    });

    const checkStatus = async () => {
      const sessionData = await chrome.storage.session.get(['hasSkippedLogin', 'pendingUrl']);
      const localData = await chrome.storage.local.get('jwtToken');
      const isLoggedIn = !!localData.jwtToken;
      const hasSkipped = !!sessionData.hasSkippedLogin;

      setIsLoggedIn(isLoggedIn);

      const canProcess = isLoggedIn || hasSkipped;

      if (sessionData.pendingUrl) {
        if (canProcess) {
          startProcessingPendingUrl(sessionData.pendingUrl);
        } else {
          setShowLoginModal(true);
        }
      } else {
        if (!canProcess) {
          setShowLoginModal(true);
        }
      }
    };

    checkStatus();

    return () => {
      stopProgressTimer();
    };
  }, []);

  const handleButtonClick = async () => {
    const result = await chrome.storage.session.get('pendingUrl');
    if (result.pendingUrl) {
        startProcessingPendingUrl(result.pendingUrl);
    } else if (url) {
        await chrome.storage.session.set({ pendingUrl: url });
        startProcessingPendingUrl(url);
    }
  };

  const handleLoginSuccess = async () => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
    setMessage("로그인 성공!");

    const result = await chrome.storage.session.get('pendingUrl');
    if (result.pendingUrl) {
      startProcessingPendingUrl(result.pendingUrl);
    } else {
      window.close();
    }
  };

  const handleSkipLoginSuccess = async () => {
    setShowLoginModal(false);
    const result = await chrome.storage.session.get('pendingUrl');
    if (result.pendingUrl) {
      startProcessingPendingUrl(result.pendingUrl);
    } else {
      window.close();
    }
  };

  return (
    <div className="popup-container">
      {loading && <LoadingIndicator message={loadingMessage} percentage={percentage} />}
      <h1>Pind</h1>
      <p className="url-text">현재 URL: {url || "로딩 중..."}</p>

      {isYoutubeVideo ? (
        <button onClick={handleButtonClick} disabled={loading || showLoginModal}>
          {loading ? "처리 중..." : "영상 속 장소 지도 보기"}
        </button>
      ) : (
        <p className="warning-message">
          이 페이지는 유튜브 영상 페이지가 아닙니다.
        </p>
      )}

      {message && <p className="status-message">{message}</p>}

      {showLoginModal && (
        <Login
          url={url}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
          onSkipLoginSuccess={handleSkipLoginSuccess}
        />
      )}
    </div>
  );
}

export default IndexPopup;
