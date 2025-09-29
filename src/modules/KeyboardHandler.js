export class KeyboardHandler {
  constructor(uiController, onCustomTime) {
    this.uiController = uiController;
    this.onCustomTime = onCustomTime;

    this.typingTimeout = null;
    this.typedValue = '';
    this.countdownInterval = null;
    this.countdownStart = null;
    this.countdownDuration = 3000; // 3 seconds

    this.bindEvents();
  }

  bindEvents() {
    this.handleKeydownBound = (e) => this.handleKeydown(e);
    document.addEventListener('keydown', this.handleKeydownBound);
  }

  handleKeydown(e) {
    // Don't capture if user is typing in an input field
    if (e.target.tagName === 'INPUT') return;

    if (this.isDigitKey(e.key)) {
      this.handleDigitInput(e.key);
    } else if (e.key === 'Enter') {
      this.handleEnterKey();
    }
  }

  isDigitKey(key) {
    return key >= '0' && key <= '9';
  }

  handleDigitInput(digit) {
    this.typedValue += digit;
    const numericValue = parseInt(this.typedValue, 10);
    this.uiController.setCustomMinutesValue(numericValue);

    this.startTypingTimeout();
    this.startCountdownCircle();
  }

  handleEnterKey() {
    this.clearTypingTimeout();
    if (this.typedValue) {
      this.executeCustomTime();
    }
  }

  startTypingTimeout() {
    this.clearTypingTimeout();
    this.typingTimeout = setTimeout(() => {
      if (this.typedValue) {
        this.executeCustomTime();
      }
    }, this.countdownDuration);
  }

  clearTypingTimeout() {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
      this.typingTimeout = null;
    }
  }

  executeCustomTime() {
    if (this.onCustomTime) {
      this.onCustomTime();
    }
    this.resetTyping();
    this.hideCountdownCircle();
  }

  resetTyping() {
    this.typedValue = '';
    this.clearTypingTimeout();
  }

  startCountdownCircle() {
    this.countdownStart = Date.now();
    this.uiController.showCountdownCircle();
    this.uiController.resetCountdownProgress();

    this.clearCountdownInterval();
    this.countdownInterval = setInterval(() => {
      const elapsed = Date.now() - this.countdownStart;
      const progress = Math.min(elapsed / this.countdownDuration, 1);
      this.uiController.updateCountdownProgress(progress);

      if (progress >= 1) {
        this.clearCountdownInterval();
        if (this.typedValue) {
          this.executeCustomTime();
        }
      }
    }, 100);
  }

  hideCountdownCircle() {
    this.clearCountdownInterval();
    this.uiController.hideCountdownCircle();
    this.uiController.resetCountdownProgress();
  }

  clearCountdownInterval() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  destroy() {
    this.clearTypingTimeout();
    this.clearCountdownInterval();
    document.removeEventListener('keydown', this.handleKeydownBound);
  }
}