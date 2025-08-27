let statusUpdatePort: chrome.runtime.Port | null = null;

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "loading-status") {
    statusUpdatePort = port;
    console.log("Background: Port connection with popup successful.");

    port.onMessage.addListener(async (message) => {
      if (message.type === "showMap") {
        console.log(`Background: Received ${message.type} event through port.`);
        
        // Load saved previous task duration and send to popup
        const result = await chrome.storage.local.get("lastRequestDuration");
        const estimatedDuration = result.lastRequestDuration || 8000; // Default 8 seconds
        port.postMessage({ status: "starting", estimatedDuration });

        processAndShowMap(message.url, message.jwtToken, message.tokenType);
      }
    });

    port.onDisconnect.addListener(() => {
      statusUpdatePort = null;
      console.log("Background: Port connection with popup disconnected.");
    });
  }
});

const API_BASE_URL = "http://localhost:8000";
const WEB_MAP_BASE_URL = "http://localhost:3000";

// Convert technical server messages to user-friendly messages
function getFriendlyMessage(serverMessage: string, progress: number): string {
  if (!serverMessage) {
    return "analyzing...";
  }
  
  const message = serverMessage.toLowerCase();
  
  // // Default messages based on progress
  // if (progress < 20) {
  //   return "Checking video information...";
  // } else if (progress < 40) {
  //   return "Analyzing video content...";
  // } else if (progress < 70) {
  //   return "Finding location information...";
  // } else if (progress < 90) {
  //   return "Adding markers to map...";
  // } else {
  //   return "Completing analysis...";
  // }
}

async function processAndShowMap(youtubeUrl: string, jwtToken: string, tokenType: string) {
  const startTime = Date.now();
  
  console.log('[PIND_DEBUG] processAndShowMap started with:', {
    youtubeUrl: youtubeUrl,
    hasJwtToken: !!jwtToken,
    jwtTokenLength: jwtToken?.length,
    tokenType: tokenType
  });
  
  try {
    statusUpdatePort?.postMessage({ status: "extracting" });

    const apiUrl = `${API_BASE_URL}/api/v1/youtube/process`;
    const headers: HeadersInit = { 
      "Content-Type": "application/json",
      "Authorization": `${tokenType} ${jwtToken}`
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ url: youtubeUrl }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || `Backend server error: ${response.statusText}`);
    }

    statusUpdatePort?.postMessage({ status: "mapping" });

    const locations = data;
    const locationsData = JSON.stringify(locations);
    // Logged-in users go to dashboard
    let finalUrl = `${WEB_MAP_BASE_URL}/dashboard?locations=${encodeURIComponent(locationsData)}`;

    const storedData = await chrome.storage.local.get('userEmail');
    const userEmail = storedData.userEmail || 'unknown@example.com';
    
    console.log('[PIND_DEBUG] Before URL construction:', {
      hasJwtToken: !!jwtToken,
      jwtTokenLength: jwtToken?.length,
      tokenType: tokenType,
      userEmail: userEmail,
      locations: locations
    });
    
    finalUrl += `&token=${encodeURIComponent(jwtToken)}&token_type=${encodeURIComponent(tokenType)}&user_email=${encodeURIComponent(userEmail)}&auto_login=true&source=extension`;
    
    console.log('[PIND_DEBUG] Final URL parts:', {
      jwtTokenFirst10: jwtToken.substring(0, 10),
      jwtTokenLast10: jwtToken.substring(jwtToken.length - 10),
      encodedToken: encodeURIComponent(jwtToken).substring(0, 50) + '...',
      tokenType: tokenType,
      userEmail: userEmail
    });
    console.log('[PIND_PLASMO] Creating dashboard URL with auth:', finalUrl);
    console.log('[PIND_PLASMO] URL components:', {
      baseUrl: `${WEB_MAP_BASE_URL}/dashboard`,
      hasLocations: !!locations,
      hasToken: !!jwtToken,
      userEmail: userEmail
    });

    // Save analysis results and notify popup (don't open web map immediately)
    await chrome.storage.local.set({ 
      analysisResult: finalUrl,
      analysisStatus: "completed",
      analysisMessage: "Analysis complete!"
    });
    statusUpdatePort?.postMessage({ status: "complete" });

  } catch (error) {
    console.error("Error occurred during background processing:", error);
    const errorMessage = error instanceof Error ? error.message : "An error occurred during location extraction.";
    
    // Save error state to storage
    await chrome.storage.local.set({ 
      analysisStatus: "error",
      analysisMessage: "An error occurred during analysis. Please try again later."
    });
    
    statusUpdatePort?.postMessage({ status: "error", message: errorMessage });
    chrome.notifications.create({
      type: "basic",
      iconUrl: chrome.runtime.getURL("assets/icon.png"),
      title: "Pind Processing Error",
      message: errorMessage
    });
  } finally {
    // Measure and save task duration
    const endTime = Date.now();
    const duration = endTime - startTime;
    await chrome.storage.local.set({ lastRequestDuration: duration });
    console.log(`This task duration: ${duration}ms`);
  }
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "handleIconClick") {
    console.log(`Background: Received ${message.type} event. Saving URL and opening popup.`);
    (async () => {
      const dataToStore = { 
        pendingUrl: message.url,
        youtubeTabId: sender.tab?.id 
      };
      console.log("Background: Data to store in session", dataToStore);
      await chrome.storage.session.set(dataToStore);
      console.log("Background: Session storage complete");
      
      // Check login status
      const { jwtToken, tokenType } = await chrome.storage.local.get(['jwtToken', 'tokenType']);
      
      console.log("Background: Token status check", { hasJwtToken: !!jwtToken, hasTokenType: !!tokenType });
      
      if (jwtToken && tokenType) {
        // Logged-in user: Start analysis automatically
        console.log("Background: Logged-in user - Starting automatic analysis", { url: message.url });
        
        // Save analysis status to storage
        await chrome.storage.local.set({ 
          analysisStatus: "analyzing",
          analysisMessage: "analyzing..."
        });
        
        // Open popup
        chrome.action.openPopup();
        
        // Start analysis after a short delay
        setTimeout(() => {
          console.log("Background: setTimeout executed - calling processAndShowMap", { 
            url: message.url, 
            hasToken: !!jwtToken, 
            jwtTokenLength: jwtToken?.length,
            tokenType 
          });
          processAndShowMap(message.url, jwtToken, tokenType);
        }, 500);
        
        sendResponse({ status: "analysis_started" });
      } else {
        // Non-logged-in user: Just open popup
        console.log("Background: Non-logged-in user - Opening popup only");
        chrome.action.openPopup();
        sendResponse({ status: "popup_opened" });
      }
    })();
    return true;
  } else if (message.type === "startProcessing") {
    console.log(`Background: Received ${message.type} event. Starting processing immediately.`);
    (async () => {
      // Use tokens passed from popup first, otherwise get from storage
      let jwtToken = message.jwtToken;
      let tokenType = message.tokenType;
      
      if (!jwtToken || !tokenType) {
        const stored = await chrome.storage.local.get(['jwtToken', 'tokenType']);
        jwtToken = stored.jwtToken;
        tokenType = stored.tokenType;
      }
      
      console.log('[PIND_DEBUG] startProcessing with tokens:', {
        fromMessage: { hasToken: !!message.jwtToken, hasType: !!message.tokenType },
        finalTokens: { hasJwtToken: !!jwtToken, jwtTokenLength: jwtToken?.length, tokenType: tokenType }
      });
      
      processAndShowMap(message.url, jwtToken, tokenType);
      sendResponse({ status: "processing_started" });
    })();
    return true;
  }
});

const AUTH_CALLBACK_URL = "http://localhost:3000/auth/callback";

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  console.log(`Background: Tab update detected - tabId: ${tabId}, status: ${changeInfo.status}, url: ${tab.url}`);
  
  if (changeInfo.status === 'complete' && tab.url?.startsWith(AUTH_CALLBACK_URL)) {
    console.log("Background: Callback URL detected!", tab.url);
    try {
      const url = new URL(tab.url);
      const params = new URLSearchParams(url.search);
      const jwtToken = params.get('token');
      const tokenType = params.get('token_type');
      const userEmail = params.get('user_email'); // Assuming email is also passed

      console.log("Background: Token parameter parsing result", { jwtToken: !!jwtToken, tokenType, userEmail });

      if (jwtToken && tokenType) {
        await chrome.storage.local.set({
          jwtToken: jwtToken,
          tokenType: tokenType,
          userEmail: userEmail || '' // Save email if provided
        });
        console.log("Background: Token storage successful!");

        // Close the login tab
        chrome.tabs.remove(tabId);

        // Get stored YouTube tab ID and return to it
        const { youtubeTabId, pendingUrl } = await chrome.storage.session.get(['youtubeTabId', 'pendingUrl']);
        console.log("Background: Checking stored data", { youtubeTabId, pendingUrl: !!pendingUrl });
        
        if (youtubeTabId) {
          try {
            // Check if the tab still exists
            const youtubeTab = await chrome.tabs.get(youtubeTabId);
            if (youtubeTab) {
              // Switch to the YouTube tab
              chrome.tabs.update(youtubeTabId, { active: true });
              chrome.windows.update(youtubeTab.windowId, { focused: true });
              
              // Notify the YouTube tab about login success
              chrome.tabs.sendMessage(youtubeTabId, {
                type: "loginSuccess",
                jwtToken: jwtToken,
                tokenType: tokenType
              });

              // Start analysis automatically after successful login
              if (pendingUrl) {
                console.log("Background: Starting automatic analysis after successful login", { pendingUrl, jwtToken: !!jwtToken, tokenType });
                
                // Save analysis status to storage
                await chrome.storage.local.set({ 
                  analysisStatus: "analyzing",
                  analysisMessage: "analyzing..."
                });
                console.log("Background: Analysis status storage complete");
                
                // Open popup to show loading UI
                chrome.action.openPopup();
                console.log("Background: Popup open request complete");
                
                // Start analysis after a short delay
                setTimeout(() => {
                  console.log("Background: setTimeout executed - starting analysis function call");
                  processAndShowMap(pendingUrl, jwtToken, tokenType);
                }, 500);
                console.log("Background: setTimeout setup complete");
              } else {
                console.log("Background: No pendingUrl - skipping automatic analysis");
              }
            }
          } catch (error) {
            console.log("Background: YouTube tab no longer exists.", error);
          }
        } else {
          console.log("Background: No youtubeTabId found.");
        }

        // Optional: Notify the user of success
        chrome.notifications.create({
          type: "basic",
          iconUrl: chrome.runtime.getURL("assets/icon.png"),
          title: "Login Successful",
          message: "Successfully logged into Pind."
        });

      }
    } catch (error) {
      console.error("Background: Error occurred during token processing:", error);
      chrome.notifications.create({
        type: "basic",
        iconUrl: chrome.runtime.getURL("assets/icon.png"),
        title: "Login Error",
        message: "An error occurred during login processing."
      });
    }
  }
});
