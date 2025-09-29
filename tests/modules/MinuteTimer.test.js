import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'

// Mock the CSS import
vi.mock('../../src/style.css', () => ({}))

// Mock all the module dependencies
vi.mock('../../src/modules/TimerState.js')
vi.mock('../../src/modules/UIController.js')
vi.mock('../../src/modules/AudioManager.js')
vi.mock('../../src/modules/KeyboardHandler.js')

import { MinuteTimer } from '../../src/modules/MinuteTimer.js'
import { TimerState } from '../../src/modules/TimerState.js'
import { UIController } from '../../src/modules/UIController.js'
import { AudioManager } from '../../src/modules/AudioManager.js'
import { KeyboardHandler } from '../../src/modules/KeyboardHandler.js'

describe('MinuteTimer Integration', () => {
  let minuteTimer
  let mockState, mockUI, mockAudio, mockKeyboard

  beforeEach(() => {
    // Create mock instances
    mockState = {
      addEventListener: vi.fn(),
      setTime: vi.fn(),
      start: vi.fn(),
      toggle: vi.fn(),
      reset: vi.fn()
    }

    mockUI = {
      updateDisplay: vi.fn(),
      restoreTitle: vi.fn(),
      getCustomMinutesValue: vi.fn().mockReturnValue(10)
    }

    mockAudio = {
      initialise: vi.fn(),
      playBeep: vi.fn()
    }

    mockKeyboard = {
      destroy: vi.fn()
    }

    // Mock the constructors
    TimerState.mockImplementation(() => mockState)
    UIController.mockImplementation(() => mockUI)
    AudioManager.mockImplementation(() => mockAudio)
    KeyboardHandler.mockImplementation(() => mockKeyboard)

    minuteTimer = new MinuteTimer()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('initialisation', () => {
    it('should create all required modules', () => {
      expect(TimerState).toHaveBeenCalled()
      expect(UIController).toHaveBeenCalled()
      expect(AudioManager).toHaveBeenCalled()
      expect(KeyboardHandler).toHaveBeenCalledWith(mockUI, expect.any(Function))
    })

    it('should bind event listeners', () => {
      expect(mockState.addEventListener).toHaveBeenCalledWith('timeChanged', expect.any(Function))
      expect(mockState.addEventListener).toHaveBeenCalledWith('tick', expect.any(Function))
      expect(mockState.addEventListener).toHaveBeenCalledWith('started', expect.any(Function))
      expect(mockState.addEventListener).toHaveBeenCalledWith('paused', expect.any(Function))
      expect(mockState.addEventListener).toHaveBeenCalledWith('reset', expect.any(Function))
      expect(mockState.addEventListener).toHaveBeenCalledWith('timerFinished', expect.any(Function))
    })

    it('should initialise UI display', () => {
      expect(mockUI.updateDisplay).toHaveBeenCalledWith(mockState)
    })
  })

  describe('Public API', () => {
    it('should set timer with valid minutes', () => {
      minuteTimer.setTimer(5)

      expect(mockState.setTime).toHaveBeenCalledWith(300) // 5 * 60
      expect(mockState.start).toHaveBeenCalled()
    })

    it('should not set timer with invalid minutes', () => {
      minuteTimer.setTimer(0)
      minuteTimer.setTimer(-5)
      minuteTimer.setTimer('invalid')

      expect(mockState.setTime).not.toHaveBeenCalled()
      expect(mockState.start).not.toHaveBeenCalled()
    })

    it('should toggle pause', () => {
      minuteTimer.togglePause()
      expect(mockState.toggle).toHaveBeenCalled()
    })

    it('should reset timer', () => {
      minuteTimer.resetTimer()
      expect(mockState.reset).toHaveBeenCalled()
    })

    it('should set custom time', () => {
      minuteTimer.setCustomTime()

      expect(mockUI.getCustomMinutesValue).toHaveBeenCalled()
      expect(mockState.setTime).toHaveBeenCalledWith(600) // 10 * 60
      expect(mockState.start).toHaveBeenCalled()
    })

    it('should not set custom time with invalid input', () => {
      mockUI.getCustomMinutesValue.mockReturnValue(0)
      minuteTimer.setCustomTime()

      expect(mockState.setTime).not.toHaveBeenCalled()
    })
  })

  describe('Event Handling', () => {
    let eventHandlers

    beforeEach(() => {
      // Extract event handlers for testing
      eventHandlers = {}
      mockState.addEventListener.mock.calls.forEach(([event, handler]) => {
        eventHandlers[event] = handler
      })
    })

    it('should update UI on timeChanged event', () => {
      eventHandlers.timeChanged()
      expect(mockUI.updateDisplay).toHaveBeenCalledWith(mockState)
    })

    it('should update UI on tick event', () => {
      eventHandlers.tick()
      expect(mockUI.updateDisplay).toHaveBeenCalledWith(mockState)
    })

    it('should initialise audio and update UI on started event', () => {
      eventHandlers.started()
      expect(mockUI.updateDisplay).toHaveBeenCalledWith(mockState)
      expect(mockAudio.initialise).toHaveBeenCalled()
    })

    it('should update UI and restore title on paused event', () => {
      eventHandlers.paused()
      expect(mockUI.updateDisplay).toHaveBeenCalledWith(mockState)
      expect(mockUI.restoreTitle).toHaveBeenCalled()
    })

    it('should update UI and restore title on reset event', () => {
      eventHandlers.reset()
      expect(mockUI.updateDisplay).toHaveBeenCalledWith(mockState)
      expect(mockUI.restoreTitle).toHaveBeenCalled()
    })

    it('should play beep on timerFinished event', () => {
      eventHandlers.timerFinished()
      expect(mockAudio.playBeep).toHaveBeenCalled()
    })
  })

  describe('Getters', () => {
    it('should return state instance', () => {
      expect(minuteTimer.getState()).toBe(mockState)
    })

    it('should return UI instance', () => {
      expect(minuteTimer.getUI()).toBe(mockUI)
    })

    it('should return audio instance', () => {
      expect(minuteTimer.getAudio()).toBe(mockAudio)
    })
  })

  describe('Cleanup', () => {
    it('should destroy keyboard handler and reset state', () => {
      minuteTimer.destroy()

      expect(mockKeyboard.destroy).toHaveBeenCalled()
      expect(mockState.reset).toHaveBeenCalled()
    })
  })
})