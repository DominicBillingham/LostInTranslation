import storage from './LocalStorage.ts';

class MusicManager {
    
    private static _instance: MusicManager | null = null;
    static get instance(): MusicManager {
        if (!this._instance) this._instance = new MusicManager();
        return this._instance;
    }
    
    private musicEl: HTMLAudioElement | null = null;
    private clamp01(v: number) { return Math.max(0, Math.min(1, v)); }
    
    async startMusic(src: string = `${import.meta.env.BASE_URL}chill.mp3`) {
        try {
            
            if (!this.musicEl) {
                this.musicEl = new Audio();
                this.musicEl.loop = true;
                this.musicEl.preload = 'auto';
                const p =  storage.getMusicVolume(20)
                this.musicEl.volume = this.clamp01(p / 100);
            } else {
                // Ensure current element reflects stored volume even if already created
                const p =  storage.getMusicVolume(20)
                this.musicEl.volume = this.clamp01(p / 100);
            }

            const resolved = new URL(src, window.location.origin).href;
            if (this.musicEl.src !== resolved) {
                this.musicEl.src = resolved;
            }
            await this.musicEl.play();
        } catch {
            // Gracefully fail if file missing or autoplay blocked
        }
    }

    stopMusic() {
        this.musicEl?.pause();
    }
}

export default MusicManager.instance;