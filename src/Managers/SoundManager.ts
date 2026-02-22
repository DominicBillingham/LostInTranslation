import StorageManager from '@/Managers/LocalStorage.ts';

export interface MusicAPI {
    startMusic(src?: string): Promise<void>;
    stopMusic(): void;
}

let musicEl: HTMLAudioElement | null = null;

function clamp01(v: number) { 
    return Math.max(0, Math.min(1, v)); 
}

const MusicManager: MusicAPI = {
    async startMusic(src: string = `${import.meta.env.BASE_URL}chill.mp3`) {
        try {
            if (!musicEl) {
                musicEl = new Audio();
                musicEl.loop = true;
                musicEl.preload = 'auto';
                const p = StorageManager.getMusicVolume(20);
                musicEl.volume = clamp01(p / 100);
            } else {
                // Ensure current element reflects stored volume even if already created
                const p = StorageManager.getMusicVolume(20);
                musicEl.volume = clamp01(p / 100);
            }

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
    }
};

export default MusicManager;