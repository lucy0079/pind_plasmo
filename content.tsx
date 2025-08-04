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

// 아이콘을 오른쪽 컨트롤 패널에 삽입합니다. (가장 안정적인 기본 설정)
export const getInlineAnchor: PlasmoGetInlineAnchor = () =>
  document.querySelector(".ytp-right-controls")

export const getShadowHostId = () => "pind-youtube-button"


const YouTubeButton = () => {
  // Button click sends a message to the background script
  const handleButtonClick = () => {
    console.log("콘텐츠 스크립트: 아이콘 클릭. 백그라운드에 상태 확인 요청.");
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