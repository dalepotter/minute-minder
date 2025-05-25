import './style.css';

let timerDisplay = document.getElementById('timer');
let totalSeconds = 0;
let interval = null;
const originalTitle = document.title;
let audioCtx = null;

function updateDisplay() {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  timerDisplay.textContent = formattedTime;
  document.title = formattedTime; // Update page title
  history.replaceState(null, '', window.location.pathname); // Reset history entry to prevent clutter
}

function setTimer(minutes) {
  clearInterval(interval);
  interval = null;
  totalSeconds = minutes * 60;
  updateDisplay();
}

function setCustomTime() {
  const minutes = parseInt(document.getElementById('customMinutes').value);
  if (!isNaN(minutes) && minutes > 0) {
    setTimer(minutes);
  }
}

function startTimer() {
  if (totalSeconds <= 0 || interval) return;

  // Unlock AudioContext if not already
  if (!audioCtx) {
    audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    const dummy = audioCtx.createBufferSource();
    dummy.connect(audioCtx.destination);
    dummy.start(0);
  }

  interval = setInterval(() => {
    if (totalSeconds <= 0) {
      clearInterval(interval);
      interval = null;
      updateDisplay();
      restoreTitle();
      playBeep();
    } else {
      totalSeconds--;
      updateDisplay();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(interval);
  interval = null;
  restoreTitle();
}

function resetTimer() {
  clearInterval(interval);
  interval = null;
  totalSeconds = 0;
  updateDisplay();
  restoreTitle();
}

function restoreTitle() {
  document.title = originalTitle;
}

function playBeep() {
  if (!audioCtx) return;

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // High pitch
  gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime); // Low volume

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 1); // Beep for 1 second
}

window.setTimer = setTimer;
window.setCustomTime = setCustomTime;
window.startTimer = startTimer;
window.pauseTimer = pauseTimer;
window.resetTimer = resetTimer;

updateDisplay(); // Initialize display
