console.log('Learning Extension: Content script loaded on:', window.location.href);

// Global variables to track Sci-Hub links
let sciHubLinks = [];
let currentLinkIndex = -1;

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
        findAndInjectSciHubLinks((count) => {
            if (count > 0) {
                sendResponse({ success: true, count: count });
            } else {
                sendResponse({ success: false, count: 0 });
            }
        });
        return true;
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

function getAvailableService(callback) {
  chrome.runtime.sendMessage({ type: "CHECK_SCIHUB" }, (response) => {
      if (response && response.available) {
          callback(response.url);
      } else {
          callback(null);
      }
  });
}

function checkAvailableDoc(scihubUrl) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({
      type: "CHECK_PDF_AVAILABLE",
      url: scihubUrl
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error in message:', chrome.runtime.lastError);
        resolve(false);
      } else {
        resolve(response.hasPdf);
      }
    });
  });
}

// Function to find DOI links and inject Sci-Hub links
function findAndInjectSciHubLinks(callback) {
    // Using a key icon to represent sci-hub links
    const sciHubKeyIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; color: #ff0000;">
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
      </svg>
    `;
    
    let count = 0;
    const doiLinks = document.querySelectorAll('a[href*="doi.org"]');
    
    // Reset global variables
    sciHubLinks = [];
    currentLinkIndex = -1;
    
    getAvailableService((serviceUrl) => {
      if (!serviceUrl) {
          console.log('No Sci-Hub service available.');
          callback(0);
          return;
      }

      // Process DOI links sequentially to check each one
      const processLinks = async () => {
        for (const link of doiLinks) {
          if (link.nextElementSibling && link.nextElementSibling.classList.contains('scihub-link')) {
              count++;
              continue;
          }

          const doiUrl = link.href;
          const doiMatch = doiUrl.match(/doi\.org\/(.*)/);

          if (doiMatch && doiMatch[1]) {
              const doi = doiMatch[1];
              const sciHubUrl = `${serviceUrl}${doi}`;
              
              try {
                const hasPdf = await checkAvailableDoc(sciHubUrl);
                
                if (hasPdf) {
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
                  
                  // Highlight the DOI link to make it more visible
                  link.style.backgroundColor = '#fff3cd';
                  link.style.border = '1px solid #ffeaa7';
                  link.style.borderRadius = '3px';
                  link.style.padding = '2px 4px';
                  link.style.transition = 'all 0.3s ease';
                  
                  // Add hover effect
                  link.addEventListener('mouseenter', () => {
                    link.style.backgroundColor = '#ffeaa7';
                    link.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                  });
                  
                  link.addEventListener('mouseleave', () => {
                    link.style.backgroundColor = '#fff3cd';
                    link.style.boxShadow = 'none';
                  });
                  
                  // Store the link for navigation
                  sciHubLinks.push({
                    doiLink: link,
                    sciHubLink: sciHubLink,
                    element: link.parentElement
                  });
                  
                  count++;
                }
              } catch (error) {
                console.error('Error processing DOI link:', error);
              }
          }
        }
        
        console.log(`Learning Extension: Added ${count} Sci-Hub links.`);
        callback(count);
        
        // Add floating summary if links were found
        if (count > 0) {
          addNavigationPanel();
        }
      };

      processLinks();
  });
}

// Function to add navigation panel
function addNavigationPanel() {
  // Remove existing navigation if any
  const existingNav = document.getElementById('scihub-navigation');
  if (existingNav) {
    existingNav.remove();
  }
  
  const navigation = document.createElement('div');
  navigation.id = 'scihub-navigation';
  navigation.style.cssText = `
    position: fixed;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    background: rgba(40, 167, 69, 0.9);
    color: white;
    border-radius: 8px;
    padding: 8px;
    z-index: 10001;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    display: flex;
    flex-direction: column;
    gap: 4px;
  `;
  
  // Up arrow button
  const upBtn = document.createElement('button');
  upBtn.innerHTML = '▲';
  upBtn.style.cssText = `
    width: 32px;
    height: 32px;
    border: none;
    background: rgba(255,255,255,0.2);
    color: white;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    transition: all 0.2s ease;
  `;
  
  // Down arrow button
  const downBtn = document.createElement('button');
  downBtn.innerHTML = '▼';
  downBtn.style.cssText = upBtn.style.cssText;
  
  // Add hover effects
  [upBtn, downBtn].forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.background = 'rgba(255,255,255,0.3)';
      btn.style.transform = 'scale(1.1)';
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.background = 'rgba(255,255,255,0.2)';
      btn.style.transform = 'scale(1)';
    });
  });
  
  // Navigation functions
  upBtn.addEventListener('click', () => navigateToPrevious());
  downBtn.addEventListener('click', () => navigateToNext());
  
  navigation.appendChild(upBtn);
  navigation.appendChild(downBtn);
  document.body.appendChild(navigation);
  
  // Start with first link
  if (sciHubLinks.length > 0) {
    navigateToNext();
  }
}

// Function to navigate to next Sci-Hub link
function navigateToNext() {
  if (sciHubLinks.length === 0) return;
  
  // Remove previous highlight
  if (currentLinkIndex >= 0 && currentLinkIndex < sciHubLinks.length) {
    const prevLink = sciHubLinks[currentLinkIndex];
    prevLink.doiLink.style.boxShadow = 'none';
    prevLink.doiLink.style.border = '1px solid #ffeaa7';
  }
  
  // Move to next link
  currentLinkIndex = (currentLinkIndex + 1) % sciHubLinks.length;
  
  // Highlight current link
  const currentLink = sciHubLinks[currentLinkIndex];
  currentLink.doiLink.style.boxShadow = '0 0 0 3px rgba(255, 193, 7, 0.5)';
  currentLink.doiLink.style.border = '2px solid #ffc107';
  
  // Scroll to the link
  currentLink.element.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  });
}

// Function to navigate to previous Sci-Hub link
function navigateToPrevious() {
  if (sciHubLinks.length === 0) return;
  
  // Remove previous highlight
  if (currentLinkIndex >= 0 && currentLinkIndex < sciHubLinks.length) {
    const prevLink = sciHubLinks[currentLinkIndex];
    prevLink.doiLink.style.boxShadow = 'none';
    prevLink.doiLink.style.border = '1px solid #ffeaa7';
  }
  
  // Move to previous link
  currentLinkIndex = currentLinkIndex <= 0 ? sciHubLinks.length - 1 : currentLinkIndex - 1;
  
  // Highlight current link
  const currentLink = sciHubLinks[currentLinkIndex];
  currentLink.doiLink.style.boxShadow = '0 0 0 3px rgba(255, 193, 7, 0.5)';
  currentLink.doiLink.style.border = '2px solid #ffc107';
  
  // Scroll to the link
  currentLink.element.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  });
}