// Lightweight sound engine for SFX (click) and looping background music.
// - Click SFX now plays an audio sample (note.mp3) from the public folder with slight variation each time.
// - Background music uses an HTMLAudioElement, loops, and fails gracefully if asset missing.

class SoundManager {
  private static _instance: SoundManager | null = null;

  static get instance(): SoundManager {
    if (!this._instance) this._instance = new SoundManager();
    return this._instance;
  }

  private audioCtx: AudioContext | null = null;
  private sfxGain: GainNode | null = null;
  private musicEl: HTMLAudioElement | null = null;
  // Cached SFX sample buffer (note.mp3) and its in-flight loader
  private noteBuffer: AudioBuffer | null = null;
  private noteBufferPromise: Promise<AudioBuffer> | null = null;
  private musicVolume01 = 0.2; // 0..1
  private sfxVolume01 = 0.2; // 0..1
  private initialized = false;

  private constructor() {
    // Try to initialize volumes from localStorage
    try {
      const s = Number(localStorage.getItem('lit.soundVolume'));
      const m = Number(localStorage.getItem('lit.musicVolume'));
      if (!Number.isNaN(s)) this.sfxVolume01 = this.clamp01(s / 100);
      if (!Number.isNaN(m)) this.musicVolume01 = this.clamp01(m / 100);
    } catch {}
  }

  private ensureAudioContext() {
    if (!this.audioCtx) {
      const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (Ctx) {
        this.audioCtx = new Ctx();
        this.sfxGain = this.audioCtx.createGain();
        this.sfxGain.gain.value = this.sfxVolume01;
        this.sfxGain.connect(this.audioCtx.destination);
      }
    }
  }

  private clamp01(v: number) { return Math.max(0, Math.min(1, v)); }

  private async loadNoteBuffer(): Promise<AudioBuffer | null> {
    try {
      this.ensureAudioContext();
      if (!this.audioCtx) return null;
      if (this.noteBuffer) return this.noteBuffer;
      if (!this.noteBufferPromise) {
        this.noteBufferPromise = (async () => {
          const resp = await fetch('/note.mp3');
          if (!resp.ok) throw new Error('note.mp3 not found');
          const arr = await resp.arrayBuffer();
          const buf = await this.audioCtx!.decodeAudioData(arr);
          this.noteBuffer = buf;
          return buf;
        })();
      }
      return await this.noteBufferPromise;
    } catch {
      return null;
    }
  }

  setSoundVolume(percent: number) {
    const v = this.clamp01((percent ?? 0) / 500);
    this.sfxVolume01 = v;
    if (this.sfxGain) this.sfxGain.gain.value = v;
  }

  setMusicVolume(percent: number) {
    const v = this.clamp01((percent ?? 0) / 100);
    this.musicVolume01 = v;
    if (this.musicEl) this.musicEl.volume = v;
  }

  // Play UI click SFX by triggering note.mp3 with slight per-play variation
    async playClick() {
      return;
        try {
            this.ensureAudioContext();
            if (!this.audioCtx || !this.sfxGain) return;
            const ctx = this.audioCtx;
            if (ctx.state === 'suspended') await ctx.resume();

            const buffer = await this.loadNoteBuffer();
            if (!buffer) return;

            const src = ctx.createBufferSource();
            src.buffer = buffer;
            src.playbackRate.value = 0.7;

            src.connect(this.sfxGain);
            src.start();

            src.onended = () => {
                try { src.disconnect(); } catch {}
            };
        } catch (_) {
            // ignore
        }
    }


  // Start background music; default path is /audio/chill.mp3. Must be called from a user gesture to satisfy autoplay.
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
