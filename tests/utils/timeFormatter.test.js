import { describe, it, expect } from 'vitest'
import { TimeFormatter } from '../../src/utils/timeFormatter.js'

describe('TimeFormatter', () => {
  describe('format', () => {
    it('should format positive time correctly', () => {
      expect(TimeFormatter.format(0)).toBe('00:00')
      expect(TimeFormatter.format(60)).toBe('01:00')
      expect(TimeFormatter.format(125)).toBe('02:05')
      expect(TimeFormatter.format(3661)).toBe('61:01')
    })

    it('should format negative time correctly', () => {
      expect(TimeFormatter.format(-1)).toBe('-00:01')
      expect(TimeFormatter.format(-60)).toBe('-01:00')
      expect(TimeFormatter.format(-125)).toBe('-02:05')
    })

    it('should pad single digits with zeros', () => {
      expect(TimeFormatter.format(5)).toBe('00:05')
      expect(TimeFormatter.format(305)).toBe('05:05')
    })
  })

  describe('getEmoji', () => {
    it('should return green emoji for positive time', () => {
      expect(TimeFormatter.getEmoji(0)).toBe('🟢')
      expect(TimeFormatter.getEmoji(60)).toBe('🟢')
      expect(TimeFormatter.getEmoji(1)).toBe('🟢')
    })

    it('should return red emoji for negative time', () => {
      expect(TimeFormatter.getEmoji(-1)).toBe('🔴')
      expect(TimeFormatter.getEmoji(-60)).toBe('🔴')
    })
  })
})