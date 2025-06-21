console.log('Learning Extension: Content script loaded on:', window.location.href);

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Learning Extension: Received message:', request);
  
  try {
    switch (request.action) {
      case 'ping':
        // Simple ping to check if content script is loaded
        sendResponse({ success: true, message: 'Content script is ready' });
        break;
      case 'findDois':
        const count = findAndInjectSciHubLinks();
        if (count > 0) {
            sendResponse({ success: true, count: count });
        } else {
            sendResponse({ success: false, count: 0 });
        }
        break;
      default:
        console.log('Learning Extension: Unknown action:', request.action);
        sendResponse({ success: false, message: 'Unknown action' });
    }
  } catch (error) {
    console.error('Learning Extension: Error handling message:', error);
    sendResponse({ success: false, message: error.message });
  }
  
  // Return true to indicate we will send a response asynchronously
  return true;
});

// Function to find DOI links and inject Sci-Hub links
function findAndInjectSciHubLinks() {
    // Using a key icon to represent sci-hub links
    const sciHubKeyIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; color: #ff0000;">
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
      </svg>
    `;
    
    let count = 0;
    const doiLinks = document.querySelectorAll('a[href*="doi.org"]');
    
    doiLinks.forEach(link => {
        // Check if we've already added a link for this DOI to prevent duplicates
        if (link.nextElementSibling && link.nextElementSibling.classList.contains('scihub-link')) {
            count++;
            return;
        }
        
        const doiUrl = link.href;
        const doiMatch = doiUrl.match(/doi\.org\/(.*)/);
        
        if (doiMatch && doiMatch[1]) {
            const doi = doiMatch[1];
            const sciHubUrl = `https://sci-hub.se/${doi}`;
            
            const sciHubLink = document.createElement('a');
            sciHubLink.href = sciHubUrl;
            sciHubLink.target = '_blank';
            sciHubLink.title = 'Open this DOI on Sci-Hub';
            sciHubLink.classList.add('scihub-link');
            sciHubLink.style.marginLeft = '4px';
            sciHubLink.style.marginRight = '4px';
            sciHubLink.style.display = 'inline-flex';
            sciHubLink.style.alignItems = 'center';
            sciHubLink.innerHTML = sciHubKeyIcon;

            link.insertAdjacentElement('afterend', sciHubLink);
            count++;
        }
    });

    
    console.log(`Learning Extension: Added ${count} Sci-Hub links.`);
    return count;
} 