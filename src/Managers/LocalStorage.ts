// Centralized, safe LocalStorage helper + logging utilities

const API_URL = "https://script.google.com/macros/s/AKfycbyKQizyWawgist4t2ZSfjpQNT4ds4dSbgq8p4BpIQoPPzahEllS46vGzFa6Dtpkc3yjbw/exec";

const KEYS = {
    username: "username",
    sound: "soundVolume",
    music: "musicVolume",
    plays: "playthroughAttempts",
    logKey: "logKey",
    paperFirst: "paperFirst",
};


type Nullable<T> = T | null | undefined;

export interface StorageAPI {
    // barebones accessors (safe try/catch)
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;

    // high-level helpers used by the app
    getUsername(): string | null;
    setUsername(name: string): void;
    
    getLogKey(): string | null;
    setLogKey(name: string): void;

    getPaperFirst(): boolean;
    setPaperFirst(value: boolean): void;

    getSoundVolume(defaultValue?: number): number; // 0..100
    setSoundVolume(value: number): void;           // clamps 0..100
    
    getMusicVolume(defaultValue?: number): number; // 0..100
    setMusicVolume(value: number): void;           // clamps 0..100

    getPlaythroughAttempts(defaultValue?: number): number;
    incrementPlaythroughAttempts(): number;

    // New: logging helpers
    logStoryChoice(data: { decision: string; choice: string; timeMs?: Nullable<number> }): Promise<void>;
    logQuizChoice(data: { question: string; answer: string; wasCorrect: boolean; timeMs?: Nullable<number> }): Promise<void>;
}

// ---------- low-level safe wrappers ----------
function safeGet(key: string): string | null {
    try { return window.localStorage.getItem(key); } catch { return null; }
}

function safeSet(key: string, value: string): void {
    try { window.localStorage.setItem(key, value); } catch { /* ignore */ }
}

function safeRemove(key: string): void {
    try { window.localStorage.removeItem(key); } catch { /* ignore */ }
}

function getNumber(key: string, fallback = 0): number {
    const raw = safeGet(key);
    const n = raw == null ? NaN : Number(raw);
    return Number.isFinite(n) ? n : fallback;
}

function setNumber(key: string, value: number): void {
    safeSet(key, String(value));
}

function clamp(v: number, min: number, max: number) {
    return Math.max(min, Math.min(max, v));
}

function incrementCounter(key: string): number {
    const next = getNumber(key, 0) + 1;
    setNumber(key, next);
    return next;
}


// ---------- network ----------
async function postJson(url: string, body: unknown): Promise<void> {
    try {
        await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            mode: "no-cors"
        });
    } catch {
        // Silently ignore per requirement
    }
}

export const StorageManager: StorageAPI = {
    // basic
    getItem: safeGet,
    setItem: safeSet,
    removeItem: safeRemove,

    // app-level
    getUsername() {
        return safeGet(KEYS.username);
    },
    setUsername(name: string) {
        if (!name) return;
        safeSet(KEYS.username, name);
    },

    getLogKey() {
        return safeGet(KEYS.logKey);
    },
    setLogKey(name: string) {
        const v = (name ?? '').trim();
        if (!v) {
            safeRemove(KEYS.logKey);
            return;
        }
        safeSet(KEYS.logKey, v);
    },
    
    getPaperFirst() {
        return safeGet(KEYS.paperFirst) === "true";
    },
    setPaperFirst(value: boolean) {
        safeSet(KEYS.paperFirst, String(value));
    },
    
    getSoundVolume(defaultValue = 20) {
        return clamp(getNumber(KEYS.sound, defaultValue), 0, 100);
    },
    setSoundVolume(value: number) {
        setNumber(KEYS.sound, clamp(Number(value) || 0, 0, 100));
    },
    getMusicVolume(defaultValue = 20) {
        return clamp(getNumber(KEYS.music, defaultValue), 0, 100);
    },
    setMusicVolume(value: number) {
        setNumber(KEYS.music, clamp(Number(value) || 0, 0, 100));
    },

    getPlaythroughAttempts(defaultValue = 0) {
        return getNumber(KEYS.plays, defaultValue);
    },
    incrementPlaythroughAttempts() {
        return incrementCounter(KEYS.plays);
    },

    // logging
    async logStoryChoice({ decision, choice, timeMs }) {
        try {
            const userId = this.getUsername() || "Anonymous";
            const count = incrementCounter(decision);
            const payload = {
                Type: "Story",
                UserId: userId,
                StoryDecision: decision,
                StoryChoice: choice,
                StoryDecisionCount: count,
                TimeSpentChoosing: timeMs ?? null,
                PlaythroughCount: this.getPlaythroughAttempts(0),
                LogKey: this.getLogKey() || null,
                PaperFirst: this.getPaperFirst(),
            } as const;
            
            console.log(payload);
            
            await postJson(API_URL, payload);
        } catch {
            // ignore
        }
    },

    async logQuizChoice({ question, answer, wasCorrect, timeMs }) {
        try {
            const userId = this.getUsername() || "Anonymous";
            const count = incrementCounter(question);
            const payload = {
                Type: "Quiz",
                UserId: userId,
                QuizQuestion: question,
                QuizAnswer: answer,
                WasCorrect: wasCorrect,
                QuizAnswerCount: count,
                TimeSpentChoosing: timeMs ?? null,
                PlaythroughCount: this.getPlaythroughAttempts(0),
                LogKey: this.getLogKey() || null,
                PaperFirst: this.getPaperFirst(),
            } as const;
            
            console.log(payload);
            
            await postJson(API_URL, payload);
        } catch {
            // ignore
        }
    },
};

export default StorageManager;
