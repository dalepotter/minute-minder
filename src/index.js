import './style.css';

let timerDisplay = document.getElementById('timer');
let totalSeconds = 0;
let interval = null;

function updateDisplay() {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  timerDisplay.textContent =
    `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function setTimer(minutes) {
  clearInterval(interval);
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
  interval = setInterval(() => {
    if (totalSeconds <= 0) {
      clearInterval(interval);
      interval = null;
      updateDisplay();
      playBeep();
      alert("Time's up!");
    } else {
      totalSeconds--;
      updateDisplay();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(interval);
  interval = null;
}

function resetTimer() {
  clearInterval(interval);
  interval = null;
  totalSeconds = 0;
  updateDisplay();
}

function playBeep() {
  const ctx = new(window.AudioContext || window.webkitAudioContext)();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(880, ctx.currentTime); // High pitch
  gainNode.gain.setValueAtTime(0.1, ctx.currentTime); // Low volume

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start();
  oscillator.stop(ctx.currentTime + 1); // Beep for 1 second
}

window.setTimer = setTimer;
window.setCustomTime = setCustomTime;
window.startTimer = startTimer;
window.pauseTimer = pauseTimer;
window.resetTimer = resetTimer;

updateDisplay(); // Initialize display
