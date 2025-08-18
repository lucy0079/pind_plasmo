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
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisResultUrl, setAnalysisResultUrl] = useState<string | null>(null);
  const [backgroundAnalyzing, setBackgroundAnalyzing] = useState(false);
  const [backgroundAnalysisMessage, setBackgroundAnalysisMessage] = useState("");
  const [backgroundProgress, setBackgroundProgress] = useState(0);

  const startProcessingPendingUrl = async (pendingUrl: string) => {
    setLoading(true);
    setLoadingMessage("요청 준비 중...");
    setPercentage(0);

    const { jwtToken, tokenType } = await chrome.storage.local.get(['jwtToken', 'tokenType']);
    const port = chrome.runtime.connect({ name: "loading-status" });

    port.onMessage.addListener((msg) => {
      if (msg.type === "progress_update") {
        setPercentage(msg.progress);
        setLoadingMessage(msg.message);
      } else if (msg.status === "complete") {
        setPercentage(100);
        setTimeout(async () => {
          setLoading(false);
          // 분석 결과 URL 가져오기
          const { analysisResult } = await chrome.storage.local.get('analysisResult');
          if (analysisResult) {
            setAnalysisResultUrl(analysisResult);
            setAnalysisComplete(true);
            // 분석 결과를 사용한 후 삭제
            await chrome.storage.local.remove('analysisResult');
          }
        }, 500);
      } else if (msg.status === "error") {
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
      const { jwtToken, tokenType, analysisStatus, analysisMessage, analysisResult } = await chrome.storage.local.get(['jwtToken', 'tokenType', 'analysisStatus', 'analysisMessage', 'analysisResult']);
      setIsLoggedIn(!!jwtToken);

      // 로그인된 사용자이고 진행 중인 분석이 없다면 자동 분석 시작
      if (jwtToken && tokenType && analysisStatus !== "analyzing" && !analysisResult) {
        // 현재 탭의 URL 가져오기
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const currentUrl = tabs[0]?.url;
        
        if (currentUrl && currentUrl.includes("youtube.com/watch?v=")) {
          console.log("팝업: 로그인된 사용자 - 자동 분석 시작", { currentUrl });
          
          // 분석 상태 설정
          await chrome.storage.local.set({ 
            analysisStatus: "analyzing",
            analysisMessage: "영상 속 장소를 추출하고 있습니다..."
          });
          
          setBackgroundAnalyzing(true);
          setBackgroundAnalysisMessage("영상 속 장소를 추출하고 있습니다...");
          setBackgroundProgress(0);
          
          // background script에 분석 요청
          chrome.runtime.sendMessage({
            type: "startBackgroundAnalysis",
            url: currentUrl,
            jwtToken: jwtToken,
            tokenType: tokenType
          });
        }
      }

      // 백그라운드 분석 상태 확인
      if (analysisStatus === "analyzing") {
        setBackgroundAnalyzing(true);
        setBackgroundAnalysisMessage(analysisMessage || "분석 중...");
        setBackgroundProgress(0);
        setAnalysisComplete(false);
        setAnalysisResultUrl(null);
      } else if (analysisStatus === "completed" && analysisResult) {
        // 분석 완료 상태
        setBackgroundAnalyzing(false);
        setAnalysisComplete(true);
        setAnalysisResultUrl(analysisResult);
        setBackgroundAnalysisMessage(analysisMessage || "분석 완료!");
        // 분석 상태 초기화 (다음 분석을 위해)
        await chrome.storage.local.remove(['analysisStatus', 'analysisMessage']);
      } else if (analysisStatus === "error") {
        const { analysisProgress } = await chrome.storage.local.get('analysisProgress');
        setBackgroundAnalyzing(false);
        setAnalysisComplete(false);
        
        // 진행률 유지 (오류 발생 시에도 현재 진행률에서 멈춤)
        if (typeof analysisProgress === 'number') {
          setBackgroundProgress(analysisProgress);
        }
        
        // 더 친화적인 오류 메시지 표시
        const friendlyMessage = analysisMessage?.includes('서버에서 일시적인 문제') 
          ? analysisMessage 
          : "분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
        setMessage(friendlyMessage);
        // 에러 상태 초기화
        await chrome.storage.local.remove(['analysisStatus', 'analysisMessage']);
      } else {
        // 일반적인 상태: 이전 분석 상태 초기화
        setBackgroundAnalyzing(false);
        setAnalysisComplete(false);
        setAnalysisResultUrl(null);
        setBackgroundAnalysisMessage("");
      }
    };

    checkStatus();

    // Listen for storage changes to update login status and analysis status
    const handleStorageChange = async (changes: {[key: string]: chrome.storage.StorageChange}) => {
      if (changes.jwtToken) {
        setIsLoggedIn(!!changes.jwtToken.newValue);
      }
      
      // 분석 상태 변경 감지
      if (changes.analysisStatus) {
        const status = changes.analysisStatus.newValue;
        if (status === "analyzing") {
          const { analysisMessage } = await chrome.storage.local.get('analysisMessage');
          setBackgroundAnalyzing(true);
          setBackgroundAnalysisMessage(analysisMessage || "분석 중...");
          setBackgroundProgress(0);
          setAnalysisComplete(false);
        } else if (status === "completed") {
          const { analysisResult, analysisMessage } = await chrome.storage.local.get(['analysisResult', 'analysisMessage']);
          setBackgroundAnalyzing(false);
          setAnalysisComplete(true);
          setAnalysisResultUrl(analysisResult);
          setBackgroundAnalysisMessage(analysisMessage || "분석 완료!");
        } else if (status === "error") {
          const { analysisMessage, analysisProgress } = await chrome.storage.local.get(['analysisMessage', 'analysisProgress']);
          setBackgroundAnalyzing(false);
          setAnalysisComplete(false);
          
          // 진행률 유지 (오류 발생 시에도 현재 진행률에서 멈춤)
          if (typeof analysisProgress === 'number') {
            setBackgroundProgress(analysisProgress);
          }
          
          // 더 친화적인 오류 메시지 표시
          const friendlyMessage = analysisMessage?.includes('서버에서 일시적인 문제') 
            ? analysisMessage 
            : "분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
          setMessage(friendlyMessage);
        }
      }
      
      // 백그라운드 분석 진행률 업데이트 감지
      if (changes.analysisProgress) {
        const progress = changes.analysisProgress.newValue;
        if (typeof progress === 'number') {
          setBackgroundProgress(progress);
        }
      }
      
      // 백그라운드 분석 메시지 업데이트 감지
      if (changes.analysisMessage && backgroundAnalyzing) {
        setBackgroundAnalysisMessage(changes.analysisMessage.newValue || "분석 중...");
      }
      
      // 분석 결과 생성 감지 (analysisResult가 새로 생성되고 analysisStatus가 삭제되면 완료)
      if (changes.analysisResult && changes.analysisResult.newValue) {
        console.log("팝업: 분석 결과 감지됨", changes.analysisResult.newValue);
        // analysisStatus가 없으면 분석 완료로 간주
        const { analysisStatus } = await chrome.storage.local.get('analysisStatus');
        if (!analysisStatus) {
          console.log("팝업: 분석 완료 상태로 전환");
          setBackgroundAnalyzing(false);
          setAnalysisComplete(true);
          setAnalysisResultUrl(changes.analysisResult.newValue);
          setBackgroundAnalysisMessage("분석 완료!");
          setBackgroundProgress(100);
        }
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  const handleProcessClick = async () => {
    const { jwtToken, tokenType, userEmail } = await chrome.storage.local.get(['jwtToken', 'tokenType', 'userEmail']);
    const { pendingUrl } = await chrome.storage.session.get('pendingUrl');
    const youtubeUrl = pendingUrl || url;
    
    if (youtubeUrl && jwtToken && tokenType) {
      // JWT 토큰과 YouTube URL을 함께 웹 맵으로 전달
      const webMapUrl = `http://localhost:3000/dashboard?url=${encodeURIComponent(youtubeUrl)}&token=${encodeURIComponent(jwtToken)}&token_type=${encodeURIComponent(tokenType)}&user_email=${encodeURIComponent(userEmail || '')}`;
      
      chrome.tabs.create({ url: webMapUrl });
      window.close();
    }
  };

  const handleLoginClick = () => {
    // 현재 YouTube URL을 로그인 URL에 포함
    const returnUrl = encodeURIComponent(url || "")
    const loginUrlWithReturn = `${LOGIN_URL}&return_url=${returnUrl}`
    chrome.tabs.create({ url: loginUrlWithReturn });
    // Don't close popup - user will return after login
  };

  const handleViewMapClick = () => {
    if (analysisResultUrl) {
      chrome.tabs.create({ url: analysisResultUrl });
      window.close();
    }
  };

  return (
    <div className="popup-container">
      {(loading || backgroundAnalyzing) && <LoadingIndicator message={loading ? loadingMessage : backgroundAnalysisMessage} percentage={loading ? percentage : backgroundProgress} />}
      <h1>Pind</h1>
      <p className="url-text">현재 URL: {url || "로딩 중..."}</p>

      {isYoutubeVideo ? (
        backgroundAnalyzing ? (
          <div>
            <p className="status-message">{backgroundAnalysisMessage}</p>
            <button disabled>분석 중...</button>
          </div>
        ) : analysisComplete ? (
          <button onClick={handleViewMapClick}>
            영상 속 장소 지도 보기
          </button>
        ) : isLoggedIn ? (
          <div>
            <p className="status-message">분석을 시작합니다...</p>
            <button disabled>준비 중...</button>
          </div>
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