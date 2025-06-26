// Popup script - handles user interactions in the popup
document.addEventListener('DOMContentLoaded', function() {
  const findDoisBtn = document.getElementById('findDoisBtn');
  const statusDiv = document.getElementById('status');

  // Function to show status messages
  function showStatus(message, isSuccess = true) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${isSuccess ? 'success' : 'error'}`;
    statusDiv.style.display = 'block';
    
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 4000);
  }

  // Function to inject content script if needed
  async function ensureContentScript(tabId) {
    try {
      // Try to send a test message first
      await chrome.tabs.sendMessage(tabId, { action: 'ping' });
      return true;
    } catch (error) {
      // If content script is not loaded, inject it
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['content.js']
        });
        // Wait a bit for the script to load
        await new Promise(resolve => setTimeout(resolve, 100));
        return true;
      } catch (injectError) {
        console.error('Failed to inject content script:', injectError);
        return false;
      }
    }
  }

  const loadingDiv = document.getElementById('loading-container');
  const timerSpan = document.getElementById('timer');
  let timerInterval;

  function showLoading() {
    loadingDiv.style.display = 'flex';
    let seconds = 0;
    timerSpan.textContent = seconds;
    timerInterval = setInterval(() => {
      seconds++;
      timerSpan.textContent = seconds;
    }, 1000);
  }

  function hideLoading() {
    loadingDiv.style.display = 'none';
    clearInterval(timerInterval);
  }

  // Find DOIs button
  findDoisBtn.addEventListener('click', async () => {
    try {
      showLoading();
      // Get the active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Ensure content script is loaded
      const scriptLoaded = await ensureContentScript(tab.id);
      if (!scriptLoaded) {
        showStatus('Error: Could not connect to the page.', false);
        return;
      }
      
      // Send message to content script and get response
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'findDois' });
      hideLoading();  
      if (response.success) {
        showStatus(`Success! Added links for ${response.count} DOIs.`);
      } else {
        showStatus('Could not find any DOI links.', false);
      }
    } catch (error) {
      hideLoading();
      console.error('Error:', error);
      showStatus('Error: ' + error.message, false);
    }
  });
}); 