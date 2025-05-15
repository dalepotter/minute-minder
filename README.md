# Minute Minder: A Browser-based Countdown Timer

A distraction-free timer for work sprints and breaks. Alerts with sound, and works in the background.

A responsive countdown timer with:
- Preset buttons (20, 3, 1 min)
- Custom time input

## 🛠  Features

- Visual alert
- Works even when switching tabs

## 💻 Usage

1. Clone the repo:
   ```bash
   git clone git@github.com:dalepotter/minute-minder.git
   cd minute-minder
   ```
2. Open index.html in a browser.

## 📋 Todos
- Build using webpack
- Add audio beep when time expires
- Add emoji and blinking effects in tab title
- Remove alert on time up
- Continues counting negative time
- Add blinking time
- Auto-start on selection
- Multiple presses of the button increase the timer - e.g. 2 clicks of 20 minutes = 40 minutes, 3 presses of 1 minute = 3 minutes
- Amend custom input to minutes and seconds
- Add keyboard shortcuts: Entering numbers should populate the custom input, starting automatically if no key press in 5 seconds
- Deploy to github pages
