import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'
import { KeyboardHandler } from '../../src/modules/KeyboardHandler.js'

// Mock UIController
class MockUIController {
  constructor() {
    this.customMinutesValue = ''
    this.circleVisible = false
    this.progress = 0
  }

  setCustomMinutesValue(value) { this.customMinutesValue = value.toString() }
  focusCustomInput() { /* no-op for backward compatibility */ }
  showCountdownCircle() { this.circleVisible = true }
  hideCountdownCircle() { this.circleVisible = false }
  updateCountdownProgress(progress) { this.progress = progress }
  resetCountdownProgress() { this.progress = 0 }
}

describe('KeyboardHandler', () => {
  let keyboardHandler
  let mockUIController
  let mockOnCustomTime

  beforeEach(() => {
    mockUIController = new MockUIController()
    mockOnCustomTime = vi.fn()
    keyboardHandler = new KeyboardHandler(mockUIController, mockOnCustomTime)
    vi.useFakeTimers()
  })

  afterEach(() => {
    keyboardHandler.destroy()
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  describe('Digit Input Handling', () => {
    it('should handle single digit input', () => {
      const event = new KeyboardEvent('keydown', { key: '5' })
      document.dispatchEvent(event)

      expect(mockUIController.customMinutesValue).toBe('5')
      expect(mockUIController.circleVisible).toBe(true)
    })

    it('should accumulate multiple digit inputs', () => {
      const event1 = new KeyboardEvent('keydown', { key: '2' })
      const event2 = new KeyboardEvent('keydown', { key: '5' })

      document.dispatchEvent(event1)
      document.dispatchEvent(event2)

      expect(mockUIController.customMinutesValue).toBe('25')
    })

    it('should ignore non-digit keys', () => {
      const event = new KeyboardEvent('keydown', { key: 'a' })
      document.dispatchEvent(event)

      expect(mockUIController.customMinutesValue).toBe('')
    })

    it('should ignore keys when input field is focused', () => {
      const input = document.createElement('input')
      document.body.appendChild(input)

      const event = new KeyboardEvent('keydown', { key: '5' })
      Object.defineProperty(event, 'target', { value: input })
      document.dispatchEvent(event)

      expect(mockUIController.customMinutesValue).toBe('')
    })
  })

  describe('Enter Key Handling', () => {
    it('should execute custom time on Enter with typed value', () => {
      // First type some digits
      const digitEvent = new KeyboardEvent('keydown', { key: '1' })
      document.dispatchEvent(digitEvent)

      // Then press Enter
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' })
      document.dispatchEvent(enterEvent)

      expect(mockOnCustomTime).toHaveBeenCalled()
    })

    it('should not execute custom time on Enter without typed value', () => {
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' })
      document.dispatchEvent(enterEvent)

      expect(mockOnCustomTime).not.toHaveBeenCalled()
    })
  })

  describe('Typing Timeout', () => {
    it('should execute custom time after timeout', () => {
      const event = new KeyboardEvent('keydown', { key: '5' })
      document.dispatchEvent(event)

      vi.advanceTimersByTime(3000) // Default countdown duration

      expect(mockOnCustomTime).toHaveBeenCalled()
    })

    it('should reset timeout on new digit input', () => {
      const event1 = new KeyboardEvent('keydown', { key: '5' })
      document.dispatchEvent(event1)

      vi.advanceTimersByTime(2000) // Advance but not full duration

      const event2 = new KeyboardEvent('keydown', { key: '2' })
      document.dispatchEvent(event2)

      vi.advanceTimersByTime(2000) // Another 2 seconds (4 total)
      expect(mockOnCustomTime).not.toHaveBeenCalled()

      vi.advanceTimersByTime(1000) // 1 more second (total 3 from last input)
      expect(mockOnCustomTime).toHaveBeenCalled()
    })
  })

  describe('Countdown Circle', () => {
    it('should start countdown circle on digit input', () => {
      const event = new KeyboardEvent('keydown', { key: '3' })
      document.dispatchEvent(event)

      expect(mockUIController.circleVisible).toBe(true)
      expect(mockUIController.progress).toBe(0)
    })

    it('should update countdown progress', () => {
      const event = new KeyboardEvent('keydown', { key: '1' })
      document.dispatchEvent(event)

      vi.advanceTimersByTime(1500) // Half of 3000ms
      expect(mockUIController.progress).toBeCloseTo(0.5, 1)
    })

    it('should complete countdown and execute custom time', () => {
      const event = new KeyboardEvent('keydown', { key: '7' })
      document.dispatchEvent(event)

      vi.advanceTimersByTime(3000)
      expect(mockOnCustomTime).toHaveBeenCalled()
    })
  })

  describe('State Management', () => {
    it('should reset typing state after execution', () => {
      const event = new KeyboardEvent('keydown', { key: '4' })
      document.dispatchEvent(event)

      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' })
      document.dispatchEvent(enterEvent)

      expect(keyboardHandler.typedValue).toBe('')
    })

    it('should hide countdown circle after execution', () => {
      const event = new KeyboardEvent('keydown', { key: '6' })
      document.dispatchEvent(event)

      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' })
      document.dispatchEvent(enterEvent)

      expect(mockUIController.circleVisible).toBe(false)
    })
  })

  describe('Cleanup', () => {
    it('should clear timeouts and intervals on destroy', () => {
      const event = new KeyboardEvent('keydown', { key: '8' })
      document.dispatchEvent(event)

      keyboardHandler.destroy()

      // Advance time - should not execute callback
      vi.advanceTimersByTime(3000)
      expect(mockOnCustomTime).not.toHaveBeenCalled()
    })
  })
})