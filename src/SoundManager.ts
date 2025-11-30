// Lightweight sound engine for SFX (click) and looping background music.
// - Click SFX now plays an audio sample (note.mp3) from the public folder with slight variation each time.
// - Background music uses an HTMLAudioElement, loops, and fails gracefully if asset missing.

import storage from './storage.ts';

class SoundManager {
    
  private static _instance: SoundManager | null = null;
  static get instance(): SoundManager {
    if (!this._instance) this._instance = new SoundManager();
    return this._instance;
  }
  
  private musicEl: HTMLAudioElement | null = null;
  private musicVolume01 = 0.2; // 0..1
  private constructor() {
    try {
      const m = storage.getMusicVolume(20);
      this.musicVolume01 = this.clamp01(m / 100);
    } 
    catch {
        // fail gracefully
    }
  }

  private clamp01(v: number) { return Math.max(0, Math.min(1, v)); }
    
  setMusicVolume(percent: number) {
    const v = this.clamp01((percent ?? 0) / 100);
    this.musicVolume01 = v;
    if (this.musicEl) this.musicEl.volume = v;
  }
  
  async startMusic(src: string = `${import.meta.env.BASE_URL}chill.mp3`) {
    try {
      if (!this.musicEl) {
        this.musicEl = new Audio();
        this.musicEl.loop = true;
        this.musicEl.preload = 'auto';
        this.musicEl.volume = this.musicVolume01;
      }
      if (this.musicEl.src !== new URL(src, window.location.origin).href) {
        this.musicEl.src = src;
      }
      await this.musicEl.play().catch(() => {});
    } catch {
      // Gracefully fail if file missing or autoplay blocked
    }
  }

  stopMusic() {
    try {
      if (this.musicEl) {
        this.musicEl.pause();
      }
    } catch {}
  }
  
}

export default SoundManager.instance;
