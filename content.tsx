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
    const checkLoginStatus = async () => {
      const result = await chrome.storage.local.get('jwtToken');
      const loggedIn = !!result.jwtToken;
      setIsLoggedIn(loggedIn);
    };
    checkLoginStatus();
  }, []);

  const handleButtonClick = async () => { // async 키워드 추가
    if (isLoggedIn) {
      console.log("콘텐츠 스크립트: 버튼 클릭, 백그라운드에 메시지 전송.");

      // chrome.storage.local에서 토큰 정보 가져오기
      const result = await chrome.storage.local.get(['jwtToken', 'tokenType']);
      const jwtToken = result.jwtToken;
      const tokenType = result.tokenType;

      if (jwtToken && tokenType) {
        chrome.runtime.sendMessage({ type: "showMap", url: window.location.href, jwtToken: jwtToken, tokenType: tokenType });
      } else {
        console.error("콘텐츠 스크립트: 로그인 토큰을 찾을 수 없습니다.");
        chrome.runtime.sendMessage({ type: "openPopup" }); // 토큰이 없으면 팝업 열기 요청
      }
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
