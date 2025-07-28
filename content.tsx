import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import React, { useState, useEffect } from 'react';
import "./content.css"

const locationIconUrl = chrome.runtime.getURL("assets/location.png")

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/watch*"]
}

export const getInlineAnchor: PlasmoGetInlineAnchor = () =>
  document.querySelector(".ytp-right-controls")

const YouTubeButton = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 컴포넌트 마운트 시 로그인 상태 확인
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  const handleButtonClick = () => {
    if (isLoggedIn) {
      console.log("콘텐츠 스크립트: 버튼 클릭, 백그라운드에 메시지 전송.")
      chrome.runtime.sendMessage({ type: "showMap", url: window.location.href })
    } else {
      console.log("콘텐츠 스크립트: 로그인 필요, 팝업 열기 요청.");
      chrome.runtime.sendMessage({ type: "openPopup" }); // 팝업 열기 메시지 전송
    }
  }

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
