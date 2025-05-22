# Minute Minder: A Browser-based Countdown Timer

[![Deploy to GitHub Pages](https://github.com/dalepotter/minute-minder/actions/workflows/deploy.yml/badge.svg)](https://github.com/dalepotter/minute-minder/actions/workflows/deploy.yml)
[🚀 Live Demo](https://dalepotter.github.io/minute-minder/)

A distraction-free timer for work sprints and breaks. Alerts with sound, and works in the background.

A responsive countdown timer with:
- Preset buttons (20, 3, 1 min)
- Custom time input

## 🛠  Features

- Audio and visual alerts
- Works even when switching tabs

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
│       └── deploy.yml  # GitHub Actions workflow to auto-deploy to GitHub Pages
├── .gitignore
├── dist/               # Compiled static files
├── src/
│   ├── index.js        # Main JavaScript logic
│   └── style.css       # UI styling
├── public/
│   └── index.html      # HTML template
├── webpack.config.js   # Webpack configuration
└── package.json        # Project metadata and scripts
```


## 📋 Todos
- Add emoji and blinking effects in tab title
- Remove alert on time up
- Continues counting negative time
- Add blinking time
- Auto-start on selection
- Multiple presses of the button increase the timer - e.g. 2 clicks of 20 minutes = 40 minutes, 3 presses of 1 minute = 3 minutes
- Amend custom input to minutes and seconds
- Add keyboard shortcuts: Entering numbers should populate the custom input, starting automatically if no key press in 5 seconds
