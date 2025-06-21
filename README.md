# DOI to Sci-Hub article Extension

I have tried my best to make this extension as simple as it gets.

A Chrome extension that finds Digital Object Identifier (DOI) links of journal articles, books, and datasets on a webpage and adds a direct link to open them on Sci-Hub. 

## Features

- **Find Sci-Hub Links**: Click a button to scan the current page for DOI links. Clicking button automatically inserts a small red colored key icon (🔑) next to each found DOI, linking directly to the corresponding Sci-Hub page.


## Files Structure

```
├── manifest.json    # Extension configuration
├── popup.html       # Popup UI
├── popup.js         # Popup functionality
├── content.js       # Content script (runs on web pages)
└── README.md        # This file
```

## How to Install

1. **Open Chrome** and navigate to `chrome://extensions/`

2. **Enable Developer Mode** by toggling the switch in the top-right corner

3. **Click "Load unpacked"** and select the folder containing these files

4. **The extension should now appear** in your extensions list and toolbar

## How to Use

1. Navigate to a webpage containing links to academic papers (e.g., a journal page with DOI links).
2. Click the extension icon in your Chrome toolbar.
3. Click the **"Find Sci-Hub Links"** button.
4. A red key icon (🔑) will appear next to every DOI link on the page. Click the icon to open that paper in Sci-Hub in a new tab.