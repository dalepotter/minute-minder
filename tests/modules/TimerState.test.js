import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'
import { TimerState } from '../../src/modules/TimerState.js'

describe('TimerState', () => {
  let timerState

  beforeEach(() => {
    timerState = new TimerState()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  describe('State Management', () => {
    it('should initialize with default state', () => {
      expect(timerState.getTotalSeconds()).toBe(0)
      expect(timerState.isRunning()).toBe(false)
      expect(timerState.hasTime()).toBe(false)
      expect(timerState.isNegative()).toBe(false)
    })

    it('should set time correctly', () => {
      timerState.setTime(300) // 5 minutes
      expect(timerState.getTotalSeconds()).toBe(300)
      expect(timerState.hasTime()).toBe(true)
    })

    it('should reset beepPlayed when setting new time', () => {
      timerState.beepPlayed = true
      timerState.setTime(60)
      expect(timerState.beepPlayed).toBe(false)
    })
  })

  describe('Timer Operations', () => {
    beforeEach(() => {
      timerState.setTime(60) // 1 minute
    })

    it('should start timer and become running', () => {
      timerState.start()
      expect(timerState.isRunning()).toBe(true)
    })

    it('should pause timer and stop running', () => {
      timerState.start()
      timerState.pause()
      expect(timerState.isRunning()).toBe(false)
    })

    it('should reset timer to initial state', () => {
      timerState.start()
      timerState.reset()
      expect(timerState.getTotalSeconds()).toBe(0)
      expect(timerState.isRunning()).toBe(false)
      expect(timerState.hasTime()).toBe(false)
    })

    it('should toggle between start and pause', () => {
      timerState.toggle()
      expect(timerState.isRunning()).toBe(true)

      timerState.toggle()
      expect(timerState.isRunning()).toBe(false)
    })
  })

  describe('Timer Countdown', () => {
    it('should countdown when started', () => {
      timerState.setTime(5)
      timerState.start()

      vi.advanceTimersByTime(2000) // 2 seconds
      expect(timerState.getTotalSeconds()).toBe(3)

      vi.advanceTimersByTime(3000) // 3 more seconds
      expect(timerState.getTotalSeconds()).toBe(0)
    })

    it('should go negative after reaching zero', () => {
      timerState.setTime(2)
      timerState.start()

      vi.advanceTimersByTime(3000) // 3 seconds
      expect(timerState.getTotalSeconds()).toBe(-1)
      expect(timerState.isNegative()).toBe(true)
    })
  })

  describe('Event Emission', () => {
    it('should emit timeChanged event when time is set', () => {
      const mockHandler = vi.fn()
      timerState.addEventListener('timeChanged', mockHandler)

      timerState.setTime(120)
      expect(mockHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            totalSeconds: 120,
            state: timerState
          })
        })
      )
    })

    it('should emit started event when timer starts', () => {
      const mockHandler = vi.fn()
      timerState.addEventListener('started', mockHandler)

      timerState.setTime(60)
      timerState.start()
      expect(mockHandler).toHaveBeenCalled()
    })

    it('should emit timerFinished event when reaching zero', () => {
      const mockHandler = vi.fn()
      timerState.addEventListener('timerFinished', mockHandler)

      timerState.setTime(1)
      timerState.start()
      vi.advanceTimersByTime(1000)

      expect(mockHandler).toHaveBeenCalled()
    })

    it('should emit tick events during countdown', () => {
      const mockHandler = vi.fn()
      timerState.addEventListener('tick', mockHandler)

      timerState.setTime(3)
      timerState.start()
      vi.advanceTimersByTime(2000)

      expect(mockHandler).toHaveBeenCalledTimes(2)
    })
  })

  describe('State Queries', () => {
    it('should correctly report hasTime state', () => {
      expect(timerState.hasTime()).toBe(false)

      timerState.setTime(60)
      expect(timerState.hasTime()).toBe(true)

      timerState.start()
      expect(timerState.hasTime()).toBe(true)

      timerState.reset()
      expect(timerState.hasTime()).toBe(false)
    })

    it('should format time correctly', () => {
      timerState.setTime(125) // 2:05
      expect(timerState.getFormattedTime()).toBe('02:05')

      timerState.setTime(-61) // -1:01
      expect(timerState.getFormattedTime()).toBe('-01:01')
    })

    it('should return correct emoji', () => {
      timerState.setTime(60)
      expect(timerState.getEmoji()).toBe('🟢')

      timerState.setTime(-1)
      expect(timerState.getEmoji()).toBe('🔴')
    })
  })
})