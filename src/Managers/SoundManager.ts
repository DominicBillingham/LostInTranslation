import StorageManager from '@/Managers/LocalStorage.ts';

export interface MusicAPI {
    startMusic(src?: string): Promise<void>;
    stopMusic(): void;
    playSfx(src?: string): Promise<void>;
}

let musicEl: HTMLAudioElement | null = null;

function clamp01(v: number) { 
    return Math.max(0, Math.min(1, v)); 
}

const SoundManager: MusicAPI = {
    async startMusic(src: string = `${import.meta.env.BASE_URL}chill.mp3`) {
        try {
            if (!musicEl) {
                musicEl = new Audio();
                musicEl.loop = true;
                musicEl.preload = 'auto';
            }

            const p = StorageManager.getMusicVolume(20);
            musicEl.volume = clamp01(p / 100);

            const resolved = new URL(src, window.location.origin).href;
            if (musicEl.src !== resolved) {
                musicEl.src = resolved;
            }
            await musicEl.play();
        } catch {
            // Gracefully fail if file missing or autoplay blocked
        }
    },

    stopMusic() {
        musicEl?.pause();
    },

    async playSfx(src: string = `${import.meta.env.BASE_URL}scribble.mp3`) {
        try {
            const sfxEl = new Audio();
            sfxEl.preload = 'auto';
            
            const p = StorageManager.getSoundVolume(20);
            const volumeBase = clamp01(p / 100);
            
            // Add some slight variance in volume and pitch
            const volumeVariance = (Math.random() * 0.1) - 0.05; // -0.05 to +0.05
            const pitchVariance = (Math.random() * 0.1) + 0.95; // 0.95 to 1.05
            
            sfxEl.volume = clamp01(volumeBase + volumeVariance);
            sfxEl.playbackRate = pitchVariance;

            const resolved = new URL(src, window.location.origin).href;
            sfxEl.src = resolved;
            
            await sfxEl.play();
        } catch {
            // Gracefully fail if file missing or autoplay blocked
        }
    }
};

export default SoundManager;