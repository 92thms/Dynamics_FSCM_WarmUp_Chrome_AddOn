# Dynamics 365 FSCM WarmUp

## Overview

Dynamics 365 FSCM WarmUp is a Chrome extension designed to "warm up" a freshly started Dynamics 365 Finance and Supply Chain Management (FSCM) system by opening a large number of different modules and system pages. This can help reduce initial load times and improve system responsiveness for users.

## Features

- **Close Pages After Loading:** Option to automatically close the pages after they are loaded.
- **Add Custom Pages:** Easily add new pages to open.
- **Restore Defaults:** Reset the list of pages to the default set.
- **Export/Import Pages:** Export your list of pages to a text file and import them back when needed.

## Installation

1. Clone or download this repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" using the toggle in the top right corner.
4. Click on "Load unpacked" and select the directory where you downloaded/cloned this repository.

## Usage

1. Click on the extension icon to open the popup.
2. (Optional) Check or uncheck the "Close pages after loading" checkbox to set your preference.
3. Click the "Warm it up!" button to start the warming up process.
4. Use the "Add Page" button to add new pages to the list.
5. Use the "Restore to Default" button to reset to the default set of pages.
6. Use the "Export Pages" and "Import Pages" buttons to manage your list of pages.

## Development

### Files

- **popup.html**: The HTML file for the extension's popup UI.
- **popup.js**: The JavaScript file for the popup's functionality.
- **background.js**: The background script for the extension.
- **content.js**: The content script that runs on the Dynamics 365 FSCM pages.
- **manifest.json**: The manifest file that defines the extension.