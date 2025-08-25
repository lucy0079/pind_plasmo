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
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisResultUrl, setAnalysisResultUrl] = useState<string | null>(null);
  const [backgroundAnalyzing, setBackgroundAnalyzing] = useState(false);
  const [backgroundAnalysisMessage, setBackgroundAnalysisMessage] = useState("");

  const startProcessingPendingUrl = async (pendingUrl: string) => {
    setLoading(true);
    setLoadingMessage("Preparing request...");

    const { jwtToken, tokenType } = await chrome.storage.local.get(['jwtToken', 'tokenType']);
    const port = chrome.runtime.connect({ name: "loading-status" });

    port.onMessage.addListener((msg) => {
      if (msg.type === "progress_update") {
        setLoadingMessage(msg.message);
      } else if (msg.status === "complete") {
        setTimeout(async () => {
          setLoading(false);
          // Get analysis result URL
          const { analysisResult } = await chrome.storage.local.get('analysisResult');
          if (analysisResult) {
            setAnalysisResultUrl(analysisResult);
            setAnalysisComplete(true);
            // Remove analysis result after use
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

      // Start auto analysis if user is logged in and no analysis is in progress
      if (jwtToken && tokenType && analysisStatus !== "analyzing" && !analysisResult) {
        // Get current tab URL
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const currentUrl = tabs[0]?.url;
        
        if (currentUrl && currentUrl.includes("youtube.com/watch?v=")) {
          console.log("Popup: Logged in user - starting auto analysis", { currentUrl });
          
          // Set analysis status
          await chrome.storage.local.set({ 
            analysisStatus: "analyzing",
            analysisMessage: "Extracting locations from video..."
          });
          
          setBackgroundAnalyzing(true);
          setBackgroundAnalysisMessage("Extracting locations from video...");
          
          // Request analysis from background script
          chrome.runtime.sendMessage({
            type: "startProcessing",
            url: currentUrl,
            jwtToken: jwtToken,
            tokenType: tokenType
          });
        }
      }

      // Check background analysis status
      if (analysisStatus === "analyzing") {
        setBackgroundAnalyzing(true);
        setBackgroundAnalysisMessage(analysisMessage || "Analyzing...");
        setAnalysisComplete(false);
        setAnalysisResultUrl(null);
      } else if (analysisStatus === "completed" && analysisResult) {
        // Analysis completed status
        setBackgroundAnalyzing(false);
        setAnalysisComplete(true);
        setAnalysisResultUrl(analysisResult);
        setBackgroundAnalysisMessage(analysisMessage || "Analysis complete!");
        // Reset analysis status (for next analysis)
        await chrome.storage.local.remove(['analysisStatus', 'analysisMessage']);
      } else if (analysisStatus === "error") {
        setBackgroundAnalyzing(false);
        setAnalysisComplete(false);
        
        // Display more user-friendly error message
        const friendlyMessage = analysisMessage?.includes('temporary server issue') 
          ? analysisMessage 
          : "An error occurred during analysis. Please try again later.";
        setMessage(friendlyMessage);
        // Reset error status
        await chrome.storage.local.remove(['analysisStatus', 'analysisMessage']);
      } else {
        // Normal state: reset previous analysis status
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
      
      // Detect analysis status changes
      if (changes.analysisStatus) {
        const status = changes.analysisStatus.newValue;
        if (status === "analyzing") {
          const { analysisMessage } = await chrome.storage.local.get('analysisMessage');
          setBackgroundAnalyzing(true);
          setBackgroundAnalysisMessage(analysisMessage || "Analyzing...");
          setAnalysisComplete(false);
        } else if (status === "completed") {
          const { analysisResult, analysisMessage } = await chrome.storage.local.get(['analysisResult', 'analysisMessage']);
          setBackgroundAnalyzing(false);
          setAnalysisComplete(true);
          setAnalysisResultUrl(analysisResult);
          setBackgroundAnalysisMessage(analysisMessage || "Analysis complete!");
        } else if (status === "error") {
          const { analysisMessage } = await chrome.storage.local.get('analysisMessage');
          setBackgroundAnalyzing(false);
          setAnalysisComplete(false);
          
          // Display more user-friendly error message
          const friendlyMessage = analysisMessage?.includes('temporary server issue') 
            ? analysisMessage 
            : "An error occurred during analysis. Please try again later.";
          setMessage(friendlyMessage);
        }
      }
      
      // Detect background analysis message updates
      if (changes.analysisMessage && backgroundAnalyzing) {
        setBackgroundAnalysisMessage(changes.analysisMessage.newValue || "분석 중...");
      }
      
      // Detect analysis result generation (complete when analysisResult is created and analysisStatus is deleted)
      if (changes.analysisResult && changes.analysisResult.newValue) {
        console.log("Popup: Analysis result detected", changes.analysisResult.newValue);
        // Consider analysis complete if analysisStatus is absent
        const { analysisStatus } = await chrome.storage.local.get('analysisStatus');
        if (!analysisStatus) {
          console.log("Popup: Switching to analysis complete status");
          setBackgroundAnalyzing(false);
          setAnalysisComplete(true);
          setAnalysisResultUrl(changes.analysisResult.newValue);
          setBackgroundAnalysisMessage("분석 완료!");
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
      // Pass JWT token and YouTube URL together to web map
      const webMapUrl = `http://localhost:3000/dashboard?url=${encodeURIComponent(youtubeUrl)}&token=${encodeURIComponent(jwtToken)}&token_type=${encodeURIComponent(tokenType)}&user_email=${encodeURIComponent(userEmail || '')}`;
      
      chrome.tabs.create({ url: webMapUrl });
      window.close();
    }
  };

  const handleLoginClick = () => {
    // Include current YouTube URL in login URL
    const returnUrl = encodeURIComponent(url || "")
    const loginUrlWithReturn = `${LOGIN_URL}&return_url=${returnUrl}`
    chrome.tabs.create({ url: loginUrlWithReturn });
    // Don't close popup - user will return after login
  };

  const handleViewMapClick = () => {
    if (analysisResultUrl) {
      console.log("Opening map with URL:", analysisResultUrl);
      chrome.tabs.create({ url: analysisResultUrl });
      window.close();
    } else {
      console.error("No analysis result URL available");
      setMessage("No map data available. Please try analyzing the video again.");
    }
  };

  return (
    <div className="popup-container">
      {(loading || backgroundAnalyzing) && <LoadingIndicator message={loading ? loadingMessage : backgroundAnalysisMessage} />}
      <h1>Pind</h1>
      <p className="url-text">Current URL: {url || "Loading..."}</p>

      {isYoutubeVideo ? (
        backgroundAnalyzing ? (
          <div>
            <p className="status-message">{backgroundAnalysisMessage}</p>
            <button disabled>Analyzing...</button>
          </div>
        ) : analysisComplete ? (
          <button onClick={handleViewMapClick}>
            View Location Map
          </button>
        ) : isLoggedIn ? (
          <div>
            <p className="status-message">Starting analysis...</p>
            <button disabled>Preparing...</button>
          </div>
        ) : (
          <button onClick={handleLoginClick} disabled={loading}>
            Go to Login
          </button>
        )
      ) : (
        <p className="warning-message">
          This page is not a YouTube video page.
        </p>
      )}

      {message && <p className="status-message">{message}</p>}
    </div>
  );
}

export default IndexPopup;