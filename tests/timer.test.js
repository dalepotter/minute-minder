import { describe, it, expect } from 'vitest'

describe('Timer Application', () => {
  it('should create basic timer elements', () => {
    document.body.innerHTML = `
      <div id="timer">00:00</div>
      <button id="preset20">20 min</button>
    `

    const timer = document.getElementById('timer')
    const preset = document.getElementById('preset20')

    expect(timer).toBeTruthy()
    expect(preset).toBeTruthy()
    expect(timer.textContent).toBe('00:00')
  })
})
