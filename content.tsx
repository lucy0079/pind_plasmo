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

    /* Responsive breakpoint for YouTube player */
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
    // Check initial login status
    const checkLoginStatus = async () => {
      const { jwtToken } = await chrome.storage.local.get('jwtToken');
      setIsLoggedIn(!!jwtToken);
    };
    checkLoginStatus();

    // Listen for login success message from background
    const messageListener = (message: any) => {
      if (message.type === "loginSuccess") {
        console.log("Content script: Login success message received");
        setIsLoggedIn(true);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const handleButtonClick = async () => {
    console.log("Content script: Icon clicked. Opening popup.");
    
    // Always open popup regardless of login status
    chrome.runtime.sendMessage({
      type: "handleIconClick",
      url: window.location.href
    });
  };

  return (
    <div
      className="pind-button-container"
      title="Find locations in video"
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