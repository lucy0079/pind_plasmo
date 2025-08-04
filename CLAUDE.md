# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Reply

- Default to Korean, and only switch to English if I type 'in English'.

## Project Overview

This is a Plasmo-based browser extension called "Pind" that extracts location information from YouTube videos and displays them on a map. The extension supports user authentication with JWT tokens and can work with or without login.

## Development Commands

```bash
# Start development server with hot reload
pnpm dev

# Build for production
pnpm build

# Package the extension for distribution
pnpm package

# Install dependencies
pnpm install
```

## Architecture & Key Components

### Browser Extension Structure

- **background.ts**: Service worker handling API communication with FastAPI backend
- **popup.tsx**: Extension popup UI triggered by toolbar icon click
- **content.tsx**: Content script injected into YouTube pages, adds location button
- **login.tsx**: Authentication modal component with login/signup/password reset

### Authentication Flow

- JWT tokens stored in `chrome.storage.local` with keys: `jwtToken`, `tokenType`
- Supports both authenticated and guest usage modes
- Login modal automatically shown when not authenticated

### API Integration

- **Backend URL**: `http://localhost:9001` (FastAPI server required)
- **Web Map URL**: `http://localhost:5173` (React map application)
- **Authenticated endpoint**: `/api/v1/youtube/process`
- **Guest endpoint**: `/api/v1/youtube/without-login/process`

### Message Passing Architecture

```
popup.tsx/content.tsx → background.ts → FastAPI backend → Web Map App
```

Messages use `chrome.runtime.sendMessage()` with types:

- `"showMap"`: Process YouTube URL and open map
- `"openPopup"`: Open extension popup
- `"proceedWithoutLogin"`: Handle guest mode

### Key Files & Responsibilities

**background.ts**:

- Handles `showMap` message processing
- Makes authenticated/guest API calls to backend
- Opens new tab with map data via URL parameters
- Manages error notifications

**popup.tsx**:

- Detects YouTube video pages
- Manages login state and modal display
- Sends location extraction requests to background

**content.tsx**:

- Injects location button into YouTube player controls
- Positioned via `getInlineAnchor()` targeting `.ytp-right-controls`
- Handles both logged-in and guest interactions

**login.tsx**:

- Multi-mode authentication (login/signup/password reset)
- Stores JWT tokens in chrome.storage.local
- Supports "login without account" option

### Chrome Extension Permissions

```json
"permissions": ["storage", "notifications"],
"host_permissions": ["http://localhost:9001/*", "https://www.youtube.com/*"]
```

## Development Setup Requirements

1. **Backend Dependency**: FastAPI server must run on `http://localhost:9001`
2. **Map Application**: React app should run on `http://localhost:5173`
3. **Browser Loading**: Load `build/chrome-mv3-dev` directory in Chrome developer mode

## TypeScript Configuration

- Uses Plasmo's base tsconfig with path aliases (`~*` → `./`)
- JSX mode: `react-jsx`
- Import aliases for clean imports (e.g., `~popup.css`)

## Plasmo Framework Specifics

- Content script targets: `["https://www.youtube.com/watch*"]`
- Uses `PlasmoGetInlineAnchor` for precise DOM injection
- Asset URLs via `chrome.runtime.getURL()`
- CSS modules with naming convention matching component files
