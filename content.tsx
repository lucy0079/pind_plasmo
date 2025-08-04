import type { PlasmoCSConfig, PlasmoGetInlineAnchor, PlasmoGetShadowHostId } from "plasmo"
import React from 'react';
import "./content.css"

const locationIconUrl = chrome.runtime.getURL("assets/location.png")


export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/watch*"]
}

export const getInlineAnchor: PlasmoGetInlineAnchor = () =>
  document.querySelector(".ytp-right-controls")

export const getShadowHostId = () => "pind-youtube-button"


const YouTubeButton = () => {
  // 버튼 클릭 시 백그라운드에 메시지만 전송합니다.
  const handleButtonClick = () => {
    console.log("콘텐츠 스크립트: 아이콘 클릭. 백그라운드에 상태 확인 요청.");
    chrome.runtime.sendMessage({ 
      type: "handleIconClick", 
      url: window.location.href 
    });
  };

  return (
    <div
      className="ytp-button location-finder-button"
      title="영상 속 장소 찾기"
      onClick={handleButtonClick}
      style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative", top: "24px" }}>
      <img
        src={locationIconUrl}
        alt="Find location"
        style={{ width: "24px", height: "24px" }}
      />
    </div>
  )
}

export default YouTubeButton
