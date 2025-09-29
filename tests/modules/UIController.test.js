import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'
import { UIController } from '../../src/modules/UIController.js'

// Mock TimerState for testing
class MockTimerState {
  constructor(totalSeconds = 0, isRunning = false) {
    this.totalSeconds = totalSeconds
    this.running = isRunning
  }

  getTotalSeconds() { return this.totalSeconds }
  getFormattedTime() { return '05:00' }
  getEmoji() { return this.totalSeconds < 0 ? '🔴' : '🟢' }
  isNegative() { return this.totalSeconds < 0 }
  isRunning() { return this.running }
  hasTime() { return this.totalSeconds !== 0 || this.running }
}

describe('UIController', () => {
  let uiController
  let mockElements

  beforeEach(() => {
    // Set up DOM
    document.body.innerHTML = `
      <div id="timer">00:00</div>
      <button id="pauseButton">Pause</button>
      <button id="resetButton">Reset</button>
      <input type="number" id="customMinutes" placeholder="Custom minutes" min="1" />
      <svg id="autoStartCircle" style="display: none;">
        <circle id="autoStartProgress" />
      </svg>
    `

    uiController = new UIController()
    mockElements = uiController.elements
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('initialisation', () => {
    it('should get all required DOM elements', () => {
      expect(mockElements.timerDisplay).toBeTruthy()
      expect(mockElements.pauseButton).toBeTruthy()
      expect(mockElements.resetButton).toBeTruthy()
      expect(mockElements.customMinutes).toBeTruthy()
      expect(mockElements.autoStartCircle).toBeTruthy()
      expect(mockElements.autoStartProgress).toBeTruthy()
      expect(mockElements.body).toBe(document.body)
    })

    it('should store original title', () => {
      document.title = 'Test Title'
      const newController = new UIController()
      expect(newController.originalTitle).toBe('Test Title')
    })
  })

  describe('Display Updates', () => {
    it('should update display with positive time', () => {
      const mockState = new MockTimerState(300) // 5 minutes
      uiController.updateDisplay(mockState)

      expect(mockElements.timerDisplay.textContent).toBe('05:00')
      expect(document.title).toContain('🟢')
      expect(document.title).toContain('05:00')
      expect(mockElements.body.classList.contains('time-positive')).toBe(true)
      expect(mockElements.body.classList.contains('time-negative')).toBe(false)
    })

    it('should update display with negative time', () => {
      const mockState = new MockTimerState(-60) // -1 minute
      mockState.getFormattedTime = () => '-01:00'
      uiController.updateDisplay(mockState)

      expect(mockElements.timerDisplay.textContent).toBe('-01:00')
      expect(document.title).toContain('🔴')
      expect(mockElements.body.classList.contains('time-negative')).toBe(true)
      expect(mockElements.body.classList.contains('time-positive')).toBe(false)
      expect(mockElements.timerDisplay.classList.contains('negative-time-text')).toBe(true)
    })
  })

  describe('Control Updates', () => {
    it('should disable controls when no time', () => {
      const mockState = new MockTimerState(0, false)
      uiController.updateControls(mockState)

      expect(mockElements.pauseButton.disabled).toBe(true)
      expect(mockElements.resetButton.disabled).toBe(true)
      expect(mockElements.pauseButton.textContent).toBe('Pause')
    })

    it('should enable controls when has time', () => {
      const mockState = new MockTimerState(60, true)
      uiController.updateControls(mockState)

      expect(mockElements.pauseButton.disabled).toBe(false)
      expect(mockElements.resetButton.disabled).toBe(false)
      expect(mockElements.pauseButton.textContent).toBe('Pause')
    })

    it('should show Resume when paused with time', () => {
      const mockState = new MockTimerState(60, false)
      uiController.updateControls(mockState)

      expect(mockElements.pauseButton.textContent).toBe('Resume')
    })
  })

  describe('Title Management', () => {
    it('should restore original title', () => {
      document.title = 'Changed Title'
      uiController.originalTitle = 'Original Title'

      uiController.restoreTitle()
      expect(document.title).toBe('Original Title')
    })
  })

  describe('Custom Input Management', () => {
    it('should focus custom input', () => {
      const focusSpy = vi.spyOn(mockElements.customMinutes, 'focus')
      uiController.focusCustomInput()
      expect(focusSpy).toHaveBeenCalled()
    })

    it('should get and set custom minutes value', () => {
      uiController.setCustomMinutesValue(25)
      expect(mockElements.customMinutes.value).toBe('25')
      expect(uiController.getCustomMinutesValue()).toBe(25)
    })
  })

  describe('Countdown Circle Management', () => {
    it('should show countdown circle', () => {
      uiController.showCountdownCircle()
      expect(mockElements.autoStartCircle.style.display).toBe('block')
    })

    it('should hide countdown circle', () => {
      uiController.hideCountdownCircle()
      expect(mockElements.autoStartCircle.style.display).toBe('none')
    })

    it('should update countdown progress', () => {
      uiController.updateCountdownProgress(0.5)
      const expectedOffset = 2 * Math.PI * 13 * (1 - 0.5) // circumference * (1 - progress)
      expect(mockElements.autoStartProgress.style.strokeDashoffset).toBe(`${expectedOffset}`)
    })

    it('should reset countdown progress', () => {
      uiController.resetCountdownProgress()
      const circumference = 2 * Math.PI * 13
      expect(mockElements.autoStartProgress.style.strokeDashoffset).toBe(`${circumference}`)
    })
  })
})