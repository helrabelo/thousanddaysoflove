/**
 * Sound Manager for Delightful Audio Feedback
 * Tasteful sound effects for wedding celebration moments
 */

// Sound URLs - using free, elegant sound effects
const SOUNDS = {
  newPost: '/sounds/gentle-chime.mp3',
  milestone: '/sounds/celebration.mp3',
  reaction: '/sounds/soft-pop.mp3',
  photoAppear: '/sounds/camera-shutter.mp3'
} as const

type SoundType = keyof typeof SOUNDS

type WindowWithWebkitAudio = Window & {
  webkitAudioContext?: typeof AudioContext
}

class SoundManager {
  private audioContext: AudioContext | null = null
  private sounds: Map<SoundType, AudioBuffer> = new Map()
  private isMuted: boolean = false
  private isInitialized: boolean = false

  constructor() {
    // Check localStorage for mute preference
    if (typeof window !== 'undefined') {
      const savedMute = localStorage.getItem('wedding-sounds-muted')
      this.isMuted = savedMute === 'true'
    }
  }

  /**
   * Initialize audio context and preload sounds
   * Must be called after user interaction due to browser autoplay policies
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      // Create audio context
      if (typeof window === 'undefined') {
        throw new Error('AudioContext not available in this environment')
      }

      const AudioContextCtor =
        window.AudioContext || (window as WindowWithWebkitAudio).webkitAudioContext

      if (!AudioContextCtor) {
        throw new Error('AudioContext not supported')
      }

      this.audioContext = new AudioContextCtor()

      // Preload all sounds (optional - loads small files)
      // await this.preloadSounds()

      this.isInitialized = true
    } catch (error) {
      console.warn('Failed to initialize audio:', error)
    }
  }

  /**
   * Preload all sound files
   */
  private async preloadSounds(): Promise<void> {
    if (!this.audioContext) return

    const loadPromises = Object.entries(SOUNDS).map(async ([type, url]) => {
      try {
        const response = await fetch(url)
        const arrayBuffer = await response.arrayBuffer()
        const audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer)
        this.sounds.set(type as SoundType, audioBuffer)
      } catch {
        // Sounds are optional - fail silently
        console.debug(`Failed to load sound: ${type}`)
      }
    })

    await Promise.allSettled(loadPromises)
  }

  /**
   * Play a sound effect
   */
  async play(type: SoundType, volume: number = 0.3): Promise<void> {
    // Don't play if muted or not initialized
    if (this.isMuted || !this.audioContext) return

    try {
      // Initialize on first play if needed
      if (!this.isInitialized) {
        await this.initialize()
      }

      // Use HTML5 Audio as fallback (simpler, works without preloading)
      const audio = new Audio(SOUNDS[type])
      audio.volume = volume
      audio.play().catch(() => {
        // Autoplay blocked or file not found - fail silently
      })
    } catch (error) {
      // Audio is optional enhancement - fail silently
      console.debug(`Failed to play sound: ${type}`, error)
    }
  }

  /**
   * Toggle mute state
   */
  toggleMute(): boolean {
    this.isMuted = !this.isMuted

    // Save preference to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('wedding-sounds-muted', String(this.isMuted))
    }

    return this.isMuted
  }

  /**
   * Get current mute state
   */
  getMuteState(): boolean {
    return this.isMuted
  }

  /**
   * Set mute state
   */
  setMute(muted: boolean): void {
    this.isMuted = muted

    if (typeof window !== 'undefined') {
      localStorage.setItem('wedding-sounds-muted', String(this.isMuted))
    }
  }
}

// Singleton instance
let soundManagerInstance: SoundManager | null = null

export function getSoundManager(): SoundManager {
  if (!soundManagerInstance) {
    soundManagerInstance = new SoundManager()
  }
  return soundManagerInstance
}

// Convenience functions
export const playNewPostSound = () => getSoundManager().play('newPost', 0.2)
export const playMilestoneSound = () => getSoundManager().play('milestone', 0.4)
export const playReactionSound = () => getSoundManager().play('reaction', 0.15)
export const playPhotoSound = () => getSoundManager().play('photoAppear', 0.2)

// React hook for sound controls
export function useSoundControls() {
  const manager = getSoundManager()

  return {
    isMuted: manager.getMuteState(),
    toggleMute: () => manager.toggleMute(),
    setMute: (muted: boolean) => manager.setMute(muted)
  }
}
