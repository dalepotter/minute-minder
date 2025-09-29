export class UIController {
  constructor() {
    this.elements = this.getElements();
    this.originalTitle = document.title;
  }

  getElements() {
    return {
      timerDisplay: document.getElementById('timer'),
      pauseButton: document.getElementById('pauseButton'),
      resetButton: document.getElementById('resetButton'),
      customMinutes: document.getElementById('customMinutes'),
      autoStartCircle: document.getElementById('autoStartCircle'),
      autoStartProgress: document.getElementById('autoStartProgress'),
      body: document.body
    };
  }

  updateDisplay(state) {
    const formattedTime = state.getFormattedTime();
    this.elements.timerDisplay.textContent = formattedTime;

    // Update title
    const emoji = state.getEmoji();
    document.title = `${emoji} ${formattedTime}`;

    // Reset history entry to prevent clutter
    history.replaceState(null, '', window.location.pathname);

    // Update body classes
    this.updateBodyClasses(state);

    // Update timer text colour
    this.elements.timerDisplay.classList.toggle("negative-time-text", state.isNegative());

    // Update controls
    this.updateControls(state);
  }

  updateBodyClasses(state) {
    this.elements.body.classList.toggle("time-negative", state.isNegative());
    this.elements.body.classList.toggle("time-positive", !state.isNegative());
  }

  updateControls(state) {
    const hasTime = state.hasTime();
    this.elements.pauseButton.disabled = !hasTime;
    this.elements.resetButton.disabled = !hasTime;

    // Update pause button text
    if (state.isRunning()) {
      this.elements.pauseButton.textContent = "Pause";
    } else {
      this.elements.pauseButton.textContent = hasTime ? "Resume" : "Pause";
    }
  }

  restoreTitle() {
    document.title = this.originalTitle;
  }

  focusCustomInput() {
    this.elements.customMinutes.focus();
  }

  getCustomMinutesValue() {
    return parseInt(this.elements.customMinutes.value);
  }

  setCustomMinutesValue(value) {
    this.elements.customMinutes.value = value;
  }

  showCountdownCircle() {
    this.elements.autoStartCircle.style.display = 'block';
  }

  hideCountdownCircle() {
    this.elements.autoStartCircle.style.display = 'none';
  }

  updateCountdownProgress(progress) {
    const circumference = 2 * Math.PI * 13; // 13 is the radius
    this.elements.autoStartProgress.style.strokeDashoffset = circumference;
    this.elements.autoStartProgress.style.strokeDashoffset = circumference * (1 - progress);
  }

  resetCountdownProgress() {
    const circumference = 2 * Math.PI * 13;
    this.elements.autoStartProgress.style.strokeDashoffset = circumference;
  }
}