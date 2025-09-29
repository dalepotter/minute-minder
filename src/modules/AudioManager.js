export class AudioManager {
  constructor() {
    this.audioCtx = null;
    this.isInitialised = false;
  }

  initialise() {
    if (this.isInitialised || !this.isAudioContextAvailable()) {
      return;
    }

    try {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

      // Create a dummy sound to unlock AudioContext
      const dummy = this.audioCtx.createBufferSource();
      dummy.connect(this.audioCtx.destination);
      dummy.start(0);

      this.isInitialised = true;
    } catch (error) {
      console.warn('Failed to initialise AudioContext:', error);
    }
  }

  isAudioContextAvailable() {
    return !!(window.AudioContext || window.webkitAudioContext);
  }

  playBeep() {
    if (!this.isInitialised || !this.audioCtx) {
      return;
    }

    try {
      const oscillator = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, this.audioCtx.currentTime); // High pitch
      gainNode.gain.setValueAtTime(0.1, this.audioCtx.currentTime); // Low volume

      oscillator.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);

      oscillator.start();
      oscillator.stop(this.audioCtx.currentTime + 1); // Beep for 1 second
    } catch (error) {
      console.warn('Failed to play beep:', error);
    }
  }

  getAudioContext() {
    return this.audioCtx;
  }
}