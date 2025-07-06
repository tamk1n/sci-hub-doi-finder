chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "CHECK_SCIHUB") {
        const services = [
            "https://sci-hub.red/",
            "https://sci-hub.ru/",
            "https://sci-hub.se/",
            "https://sci-hub.st/",
            "https://sci-hub.box/",
            
        ];

        (async () => {
            for (const service of services) {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000); // waits for 5 seconds
            
                try {
                    const response = await fetch(service, { method: 'HEAD', signal: controller.signal });
                    clearTimeout(timeoutId);
                    if (response.ok) {
                        sendResponse({ available: true, url: service });
                        return;
                    }
                } catch (e) {
                    // Ignore and try next
                    clearTimeout(timeoutId);
                }
            }
            sendResponse({ available: false, url: null });
        })();

        // Return true to indicate we will respond asynchronously
        return true;
    }
    
    if (request.type === "CHECK_PDF_AVAILABLE") {
        (async () => {
            try {
                const response = await fetch(request.url);
                const data = await response.text();
                
                // Check if the page contains an embed tag with type='application/pdf'
                const hasPdfEmbed = data.includes('<embed') && data.includes('type="application/pdf"');
                
                sendResponse({ hasPdf: hasPdfEmbed });
            } catch (error) {
                console.error('Error checking PDF availability:', error);
                sendResponse({ hasPdf: false, error: error.message });
            }
        })();
        
        // Return true to indicate we will respond asynchronously
        return true;
    }
}); 