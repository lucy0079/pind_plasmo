import { useState, useEffect, useRef } from "react";
import "~popup.css";
import LoadingIndicator from "./LoadingIndicator";

// The login page URL
const LOGIN_URL = "http://localhost:3000/?auth=login";

function IndexPopup() {
  const [url, setUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isYoutubeVideo, setIsYoutubeVideo] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
    const intervalTime = duration / (limit * 1.1);
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

    const { jwtToken, tokenType } = await chrome.storage.local.get(['jwtToken', 'tokenType']);
    const port = chrome.runtime.connect({ name: "loading-status" });

    port.onMessage.addListener((msg) => {
      if (msg.status === "starting") {
        startProgressTimer(msg.estimatedDuration, 90);
      } else if (msg.status === "extracting") {
        setLoadingMessage("장소 추출 중...");
      } else if (msg.status === "mapping") {
        stopProgressTimer();
        setPercentage(100);
        setTimeout(() => {
          setLoadingMessage("지도에 표시 중...");
          setPercentage(0);
          startProgressTimer(500, 95);
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
      jwtToken: jwtToken,
      tokenType: tokenType
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
      const { jwtToken } = await chrome.storage.local.get('jwtToken');
      setIsLoggedIn(!!jwtToken);

      // Automatically start processing if logged in and a URL is pending.
      if (!!jwtToken) {
        const { pendingUrl } = await chrome.storage.session.get('pendingUrl');
        if (pendingUrl) {
          startProcessingPendingUrl(pendingUrl);
        }
      }
    };

    checkStatus();

    return () => {
      stopProgressTimer();
    };
  }, []);

  const handleProcessClick = async () => {
    const { pendingUrl } = await chrome.storage.session.get('pendingUrl');
    if (pendingUrl) {
        startProcessingPendingUrl(pendingUrl);
    } else if (url) {
        await chrome.storage.session.set({ pendingUrl: url });
        startProcessingPendingUrl(url);
    }
  };

  const handleLoginClick = () => {
    chrome.tabs.create({ url: LOGIN_URL });
    window.close(); // Close the popup after opening the login tab
  };

  return (
    <div className="popup-container">
      {loading && <LoadingIndicator message={loadingMessage} percentage={percentage} />}
      <h1>Pind</h1>
      <p className="url-text">현재 URL: {url || "로딩 중..."}</p>

      {isYoutubeVideo ? (
        isLoggedIn ? (
          <button onClick={handleProcessClick} disabled={loading}>
            {loading ? "처리 중..." : "영상 속 장소 지도 보기"}
          </button>
        ) : (
          <button onClick={handleLoginClick} disabled={loading}>
            로그인 하러 이동
          </button>
        )
      ) : (
        <p className="warning-message">
          이 페이지는 유튜브 영상 페이지가 아닙니다.
        </p>
      )}

      {message && <p className="status-message">{message}</p>}
    </div>
  );
}

export default IndexPopup;