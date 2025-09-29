import { TimeFormatter } from '../utils/timeFormatter.js';

export class TimerState extends EventTarget {
  constructor() {
    super();
    this.totalSeconds = 0;
    this.interval = null;
    this.beepPlayed = false;
  }

  setTime(seconds) {
    this.totalSeconds = seconds;
    this.beepPlayed = false;
    this.emit('timeChanged', { totalSeconds: this.totalSeconds });
  }

  start() {
    if (this.interval) return;

    this.interval = setInterval(() => {
      this.totalSeconds--;

      if (this.totalSeconds === 0 && !this.beepPlayed) {
        this.beepPlayed = true;
        this.emit('timerFinished');
      }

      this.emit('tick', { totalSeconds: this.totalSeconds });
    }, 1000);

    this.emit('started');
  }

  pause() {
    if (!this.interval) return;

    clearInterval(this.interval);
    this.interval = null;
    this.emit('paused');
  }

  reset() {
    clearInterval(this.interval);
    this.interval = null;
    this.totalSeconds = 0;
    this.beepPlayed = false;
    this.emit('reset');
  }

  toggle() {
    if (this.interval) {
      this.pause();
    } else {
      this.start();
    }
  }

  // State queries
  isRunning() {
    return this.interval !== null;
  }

  hasTime() {
    return this.totalSeconds !== 0 || this.interval !== null;
  }

  isNegative() {
    return this.totalSeconds < 0;
  }

  getFormattedTime() {
    return TimeFormatter.format(this.totalSeconds);
  }

  getEmoji() {
    return TimeFormatter.getEmoji(this.totalSeconds);
  }

  getTotalSeconds() {
    return this.totalSeconds;
  }

  // Helper method to emit events
  emit(eventType, data = {}) {
    this.dispatchEvent(new CustomEvent(eventType, { detail: { ...data, state: this } }));
  }
}