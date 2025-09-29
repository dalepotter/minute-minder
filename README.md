# Minute Minder: A Browser-based Countdown Timer

[![Deploy to GitHub Pages](https://github.com/dalepotter/minute-minder/actions/workflows/deploy.yml/badge.svg)](https://github.com/dalepotter/minute-minder/actions/workflows/deploy.yml)
[🚀 Live Demo](https://dalepotter.github.io/minute-minder/)

A distraction-free timer for work sprints and breaks. Alerts with sound, and works in the background.

A responsive countdown timer with:
- Preset buttons (20, 3, 1 min)
- Custom time input
- Time remaining within tab title

## 🛠  Features

- Audio and visual alerts
- Auto-starts on selection
- Continues counting negative time
- Works even when switching tabs
- Keyboard shortcut: Entering numbers populates the custom time input, which starts automatically if no further number entered within 3 seconds

## 💻 Usage

1. Clone the repo:
   ```bash
   git clone git@github.com:dalepotter/minute-minder.git
   cd minute-minder
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server (with live reload):
   ```bash
   npm start
   ```
   This will open the timer in your browser at http://localhost:8080.

## 🧪 Testing

This project includes a comprehensive test suite built with [Vitest](https://vitest.dev/) and JSDOM for DOM testing.

### Running Tests
```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage (if configured)
npm run test:run
```

## 🚀 Deployment

1. Build for production:
   ```bash
   npm run build
   ```
   This compiles and outputs static files to the dist/ directory, ready for deployment (e.g., GitHub Pages).

## 📁 Project Structure

```bash
minute-minder/
├── .github/
│   └── workflows/
│       ├── deploy.yml       # GitHub Actions workflow to auto-deploy to GitHub Pages
│       └── test.yml         # GitHub Actions workflow to run tests
├── .gitignore
├── dist/                    # Compiled static files
├── src/
│   ├── index.js             # Main entry point and app initialisation
│   ├── style.css            # UI styling
│   ├── modules/             # Core application modules
│   │   ├── MinuteTimer.js   # Main orchestrator class
│   │   ├── TimerState.js    # Timer state management and logic
│   │   ├── UIController.js  # DOM manipulation and display updates
│   │   ├── AudioManager.js  # Audio system and beep functionality
│   │   └── KeyboardHandler.js # Global keyboard input processing
│   └── utils/
│       └── timeFormatter.js # Time formatting utilities
├── public/
│   └── index.html           # HTML template
├── tests/
│   ├── integration.test.js  # Integration tests for full app functionality
│   ├── modules/             # Unit tests for each module
│   │   ├── MinuteTimer.test.js
│   │   ├── TimerState.test.js
│   │   ├── UIController.test.js
│   │   ├── AudioManager.test.js
│   │   └── KeyboardHandler.test.js
│   └── utils/
│       └── timeFormatter.test.js
├── webpack.config.js        # Webpack configuration
├── vitest.config.js         # Vitest testing configuration
└── package.json             # Project metadata and scripts
```


## 🏗️ Architecture

The application follows a modular architecture with clear separation of concerns:

### Core Modules

- **`MinuteTimer`** - Main orchestrator that coordinates all other modules and provides the public API
- **`TimerState`** - Manages timer state (time remaining, running status) and business logic using event-driven architecture
- **`UIController`** - Handles all DOM manipulation, display updates, and UI state management
- **`AudioManager`** - Manages audio context initialisation and sound playback
- **`KeyboardHandler`** - Processes global keyboard input with auto-start countdown functionality

### Utilities

- **`TimeFormatter`** - Pure functions for time formatting and emoji selection


## 📋 Todos
- Multiple presses of the button increase the timer - e.g. 2 clicks of 20 minutes = 40 minutes, 3 presses of 1 minute = 3 minutes
- Amend custom input to minutes and seconds
