import { TimerState } from './TimerState.js';
import { UIController } from './UIController.js';
import { AudioManager } from './AudioManager.js';
import { KeyboardHandler } from './KeyboardHandler.js';

export class MinuteTimer {
  constructor() {
    this.state = new TimerState();
    this.ui = new UIController();
    this.audio = new AudioManager();

    this.keyboard = new KeyboardHandler(this.ui, () => this.setCustomTime());

    this.bindEvents();
    this.initialise();
  }

  bindEvents() {
    // Listen to timer state events
    this.state.addEventListener('timeChanged', () => {
      this.ui.updateDisplay(this.state);
    });

    this.state.addEventListener('tick', () => {
      this.ui.updateDisplay(this.state);
    });

    this.state.addEventListener('started', () => {
      this.ui.updateDisplay(this.state);
      // Initialise audio on first timer start (user interaction)
      this.audio.initialise();
    });

    this.state.addEventListener('paused', () => {
      this.ui.updateDisplay(this.state);
      this.ui.restoreTitle();
    });

    this.state.addEventListener('reset', () => {
      this.ui.updateDisplay(this.state);
      this.ui.restoreTitle();
    });

    this.state.addEventListener('timerFinished', () => {
      this.audio.playBeep();
    });
  }

  initialise() {
    // Initial display update
    this.ui.updateDisplay(this.state);
  }

  // Public API methods (maintain backward compatibility)
  setTimer(minutes) {
    if (!isNaN(minutes) && minutes > 0) {
      this.state.setTime(minutes * 60);
      this.state.start();
    }
  }

  togglePause() {
    this.state.toggle();
  }

  resetTimer() {
    this.state.reset();
  }

  setCustomTime() {
    const minutes = this.ui.getCustomMinutesValue();
    if (!isNaN(minutes) && minutes > 0) {
      this.setTimer(minutes);
    }
  }

  // Getter methods for testing/debugging
  getState() {
    return this.state;
  }

  getUI() {
    return this.ui;
  }

  getAudio() {
    return this.audio;
  }

  getKeyboard() {
    return this.keyboard;
  }

  destroy() {
    this.keyboard.destroy();
    this.state.reset();
  }
}