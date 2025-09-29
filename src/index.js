import './style.css';
import { MinuteTimer } from './modules/MinuteTimer.js';

// Initialise the timer application
const timer = new MinuteTimer();

// Export functions to window for backward compatibility
window.setTimer = (minutes) => timer.setTimer(minutes);
window.setCustomTime = () => timer.setCustomTime();
window.togglePause = () => timer.togglePause();
window.resetTimer = () => timer.resetTimer();

// Export timer instance for testing/debugging
window.timerApp = timer;
