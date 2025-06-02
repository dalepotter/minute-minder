import './style.css';

const timerDisplay = document.getElementById('timer');
const pauseButton = document.getElementById('pauseButton');
const resetButton = document.getElementById('resetButton');
let totalSeconds = 0;
let interval = null;
const originalTitle = document.title;
let audioCtx = null;
let beepPlayed = false;
const body = document.body;
let typingTimeout = null;
let typedValue = '';

function updateDisplay() {
  const absSeconds = Math.abs(totalSeconds);
  const minutes = Math.floor(absSeconds / 60);
  const seconds = absSeconds % 60;
  const prefix = totalSeconds < 0 ? "-" : "";
  const formattedTime = `${prefix}${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  timerDisplay.textContent = formattedTime;

  // Set tab title
  const emoji = totalSeconds < 0 ? "🔴" : "🟢";
  document.title = `${emoji} ${formattedTime}`;
  history.replaceState(null, '', window.location.pathname); // Reset history entry to prevent clutter

  // Update background class
  body.classList.toggle("time-negative", totalSeconds < 0);
  body.classList.toggle("time-positive", totalSeconds >= 0);

  // Update timer text colour and blink
  timerDisplay.classList.toggle("negative-time-text", totalSeconds < 0);

  updateControls();
}

function updateControls() {
  const hasTime = totalSeconds !== 0 || interval !== null;
  pauseButton.disabled = !hasTime;
  resetButton.disabled = !hasTime;
}

function setTimer(minutes) {
  clearInterval(interval);
  interval = null;
  totalSeconds = minutes * 60;
  beepPlayed = false;
  pauseButton.textContent = "Pause";
  updateDisplay();
  startTimer();
}

function setCustomTime() {
  const minutes = parseInt(document.getElementById('customMinutes').value);
  if (!isNaN(minutes) && minutes > 0) {
    setTimer(minutes);
  }
}

function startTimer() {
  if (interval) return;

  // Unlock AudioContext if not already
  if (!audioCtx) {
    audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    const dummy = audioCtx.createBufferSource();
    dummy.connect(audioCtx.destination);
    dummy.start(0);
  }

  interval = setInterval(() => {
    totalSeconds--;

    // Play beep once when hitting exactly zero
    if (totalSeconds === 0 && !beepPlayed) {
      playBeep();
      beepPlayed = true;
    }

    updateDisplay();
  }, 1000);

  updateControls();
}

function togglePause() {
  if (interval) {
    clearInterval(interval);
    interval = null;
    pauseButton.textContent = "Resume";
    restoreTitle();
  } else {
    pauseButton.textContent = "Pause";
    startTimer();
  }

  updateControls();
}

function resetTimer() {
  clearInterval(interval);
  interval = null;
  totalSeconds = 0;
  beepPlayed = false;
  pauseButton.textContent = "Pause";
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

// Capture digit keypresses as custom minute input
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT') return;

  if (e.key >= '0' && e.key <= '9') {
    typedValue += e.key;
    document.getElementById('customMinutes').value = parseInt(typedValue, 10);

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      if (typedValue) {
        setCustomTime();
        typedValue = '';
      }
    }, 3000); // 3 seconds
  }

  if (e.key === 'Enter') {
    clearTimeout(typingTimeout);
    if (typedValue) {
      setCustomTime();
      typedValue = '';
    }
  }
});


window.setTimer = setTimer;
window.setCustomTime = setCustomTime;
window.togglePause = togglePause;
window.resetTimer = resetTimer;

updateDisplay(); // Initialize display
