import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'
import { AudioManager } from '../../src/modules/AudioManager.js'

// Mock AudioContext
const mockAudioContext = {
  createOscillator: vi.fn(() => ({
    type: '',
    frequency: { setValueAtTime: vi.fn() },
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn()
  })),
  createGain: vi.fn(() => ({
    gain: { setValueAtTime: vi.fn() },
    connect: vi.fn()
  })),
  createBufferSource: vi.fn(() => ({
    connect: vi.fn(),
    start: vi.fn()
  })),
  destination: {},
  currentTime: 0
}

describe('AudioManager', () => {
  let audioManager

  beforeEach(() => {
    // Mock global AudioContext
    global.AudioContext = vi.fn(() => mockAudioContext)
    global.webkitAudioContext = vi.fn(() => mockAudioContext)

    audioManager = new AudioManager()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initialisation', () => {
    it('should start uninitialised', () => {
      expect(audioManager.isInitialised).toBe(false)
      expect(audioManager.audioCtx).toBeNull()
    })

    it('should check AudioContext availability', () => {
      expect(audioManager.isAudioContextAvailable()).toBe(true)

      // Test when AudioContext is not available
      delete global.AudioContext
      delete global.webkitAudioContext
      const noAudioManager = new AudioManager()
      expect(noAudioManager.isAudioContextAvailable()).toBe(false)
    })

    it('should initialise AudioContext successfully', () => {
      audioManager.initialise()

      expect(audioManager.isInitialised).toBe(true)
      expect(global.AudioContext).toHaveBeenCalled()
      expect(audioManager.audioCtx).toBe(mockAudioContext)
    })

    it('should not reinitialise if already initialised', () => {
      audioManager.initialise()
      const firstContext = audioManager.audioCtx

      audioManager.initialise()
      expect(audioManager.audioCtx).toBe(firstContext)
      expect(global.AudioContext).toHaveBeenCalledTimes(1)
    })

    it('should handle initialisation errors gracefully', () => {
      global.AudioContext = vi.fn(() => { throw new Error('AudioContext failed') })

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      audioManager.initialise()

      expect(audioManager.isInitialised).toBe(false)
      expect(consoleSpy).toHaveBeenCalledWith('Failed to initialise AudioContext:', expect.any(Error))
    })
  })

  describe('Audio Playback', () => {
    beforeEach(() => {
      audioManager.initialise()
    })

    it('should play beep when initialised', () => {
      audioManager.playBeep()

      expect(mockAudioContext.createOscillator).toHaveBeenCalled()
      expect(mockAudioContext.createGain).toHaveBeenCalled()

      // Verify the returned mocks were called correctly
      const mockOscillator = mockAudioContext.createOscillator.mock.results[0].value
      const mockGain = mockAudioContext.createGain.mock.results[0].value

      expect(mockOscillator.frequency.setValueAtTime).toHaveBeenCalledWith(880, mockAudioContext.currentTime)
      expect(mockGain.gain.setValueAtTime).toHaveBeenCalledWith(0.1, mockAudioContext.currentTime)
      expect(mockOscillator.connect).toHaveBeenCalledWith(mockGain)
      expect(mockGain.connect).toHaveBeenCalledWith(mockAudioContext.destination)
      expect(mockOscillator.start).toHaveBeenCalled()
      expect(mockOscillator.stop).toHaveBeenCalledWith(mockAudioContext.currentTime + 1)
    })

    it('should not play beep when not initialised', () => {
      const uninitialisedManager = new AudioManager()
      uninitialisedManager.playBeep()

      expect(mockAudioContext.createOscillator).not.toHaveBeenCalled()
    })

    it('should handle playback errors gracefully', () => {
      mockAudioContext.createOscillator.mockImplementation(() => {
        throw new Error('Oscillator failed')
      })

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      audioManager.playBeep()

      expect(consoleSpy).toHaveBeenCalledWith('Failed to play beep:', expect.any(Error))
    })
  })

  describe('AudioContext Access', () => {
    it('should return AudioContext when initialised', () => {
      audioManager.initialise()
      expect(audioManager.getAudioContext()).toBe(mockAudioContext)
    })

    it('should return null when not initialised', () => {
      expect(audioManager.getAudioContext()).toBeNull()
    })
  })
})