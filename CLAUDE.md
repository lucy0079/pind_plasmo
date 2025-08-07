# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Reply

- Default to Korean, and only switch to English if I type 'in English'.

## Development Commands

### Core Commands
- `pnpm install` - Install dependencies
- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm package` - Package extension into zip file

### Browser Installation (Dev Mode)
1. Navigate to `chrome://extensions` (Chrome) or `edge://extensions` (Edge)
2. Enable "Developer mode"
3. Click "Load unpacked extension"
4. Select the `build/chrome-mv3-dev` directory

## Project Architecture

### Technology Stack
- **Framework**: Plasmo (browser extension framework)
- **UI**: React with TypeScript
- **Package Manager**: pnpm
- **Build Target**: Chrome Manifest V3
- **Backend Integration**: FastAPI server at `http://localhost:8000`
- **Map Viewer**: External web app at `http://localhost:5173`

### Core Extension Components

#### Background Script (`background.ts`)
- Handles API communication with backend server
- Manages JWT token authentication
- Processes YouTube URLs and extracts location data
- Coordinates between content script and popup
- Uses Chrome storage APIs for state management
- Port-based messaging system for real-time status updates

#### Content Script (`content.tsx`)
- Injects location button into YouTube player controls
- Only runs on `https://www.youtube.com/watch*` pages
- Uses Shadow DOM for style isolation
- Responsive design adapts to YouTube player size changes
- Communicates with background script via messaging

#### Popup (`popup.tsx`)
- Main UI when clicking extension icon
- Handles authentication flow with login modal
- Shows loading progress with real-time updates
- Manages both authenticated and anonymous user flows
- Stores pending URLs in session storage

#### Authentication (`login.tsx`)
- Multi-mode modal: login, signup, forgot password
- JWT token storage in `chrome.storage.local`
- Backend API integration for user management
- "Skip login" option for anonymous usage

### Data Flow
1. User clicks location button on YouTube → Content script captures URL
2. Content script sends message to background → Background opens popup
3. Popup shows auth modal (if needed) → User authenticates or skips
4. Popup triggers background processing → Background calls FastAPI backend
5. Backend extracts locations → Background opens map viewer with results

### API Integration
- **Authenticated**: `POST /api/v1/youtube/process` with JWT header
- **Anonymous**: `POST /api/v1/youtube/without-login/process`
- **Auth endpoints**: `/auth/login`, `/auth/register`, etc.

### Storage Strategy
- `chrome.storage.local`: JWT tokens, user preferences, performance metrics
- `chrome.storage.session`: Temporary data like pending URLs
- Port connections for real-time communication between popup and background

### Extension Permissions
- `storage` - For JWT tokens and user data
- `notifications` - Error notifications
- `host_permissions` - Backend API and YouTube access
- `web_accessible_resources` - Location icon asset

## Deployment
- GitHub Actions workflow in `.github/workflows/submit.yml`
- Automatic deployment to Chrome Web Store on workflow dispatch
- Uses Plasmo BPP (Browser Platform Publisher) for store submission