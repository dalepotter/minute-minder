export const TimeFormatter = {
  format(totalSeconds) {
    const absSeconds = Math.abs(totalSeconds);
    const minutes = Math.floor(absSeconds / 60);
    const seconds = absSeconds % 60;
    const prefix = totalSeconds < 0 ? "-" : "";
    return `${prefix}${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  },

  getEmoji(totalSeconds) {
    return totalSeconds < 0 ? "🔴" : "🟢";
  }
};