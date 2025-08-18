import type { PlasmoCSConfig, PlasmoGetInlineAnchor, PlasmoGetShadowHostId } from "plasmo"
import React from 'react';

// Create a style element to be injected
export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = `
    :host {
      width: 48px !important;
      height: 48px !important;
      display: flex !important;
      justify-content: center;
      align-items: center;
      transition: width 0.1s ease, height 0.1s ease;
    }
    .pind-button-container {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .pind-location-icon {
      width: 24px !important;
      height: 24px !important;
      transition: width 0.1s ease, height 0.1s ease;
    }

    /* YouTube 플레이어가 작아지는 분기점 기준 */
    @media (max-width: 580px) {
      :host {
        width: 36px !important;
        height: 36px !important;
      }
      .pind-location-icon {
        width: 20px !important;
        height: 20px !important;
      }
    }
  `
  return style
}

const locationIconUrl = chrome.runtime.getURL("assets/location.png")

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/watch*"]
}

export const getInlineAnchor: PlasmoGetInlineAnchor = () =>
  document.querySelector(".ytp-right-controls")

export const getShadowHostId = () => "pind-youtube-button"

const YouTubeButton = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    // 초기 로그인 상태 확인
    const checkLoginStatus = async () => {
      const { jwtToken } = await chrome.storage.local.get('jwtToken');
      setIsLoggedIn(!!jwtToken);
    };
    checkLoginStatus();

    // 백그라운드에서 로그인 성공 메시지 수신
    const messageListener = (message: any) => {
      if (message.type === "loginSuccess") {
        console.log("콘텐츠 스크립트: 로그인 성공 메시지 수신");
        setIsLoggedIn(true);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const handleButtonClick = async () => {
    console.log("콘텐츠 스크립트: 아이콘 클릭. 팝업 열기.");
    
    // 로그인 상태에 관계없이 항상 팝업 열기
    chrome.runtime.sendMessage({
      type: "handleIconClick",
      url: window.location.href
    });
  };

  return (
    <div
      className="pind-button-container"
      title="영상 속 장소 찾기"
      onClick={handleButtonClick}>
      <img
        src={locationIconUrl}
        alt="Find location"
        className="pind-location-icon"
      />
    </div>
  )
}

export default YouTubeButton