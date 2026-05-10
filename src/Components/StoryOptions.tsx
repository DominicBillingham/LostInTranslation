import {useEffect, useState} from "react";
import Sound from "@/Managers/SoundManager.ts";
import LocalStorage from "@/Managers/LocalStorage.ts";

interface StoryOptionsProps {
    onStart: () => void;
}

export default function StoryOptions({onStart}: StoryOptionsProps) {
    const [username, setUsername] = useState<string>("");
    const [logKey, setLogKey] = useState<string>("");
    const [paperFirst, setPaperFirst] = useState<boolean>(false);
    const [musicVolume, setMusicVolume] = useState<number>(20);
    const [soundVolume, setSoundVolume] = useState<number>(20);
    const [isLeaving, setIsLeaving] = useState<boolean>(false);

    async function onContinue() {
        LocalStorage.incrementPlaythroughAttempts();
        LocalStorage.setUsername(username.trim());
        LocalStorage.setMusicVolume(musicVolume);
        LocalStorage.setSoundVolume(soundVolume);
        LocalStorage.setLogKey(logKey);
        LocalStorage.setPaperFirst(paperFirst);

        void Sound.playSfx();
        setIsLeaving(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        void Sound.startMusic();
        onStart();
    }

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const urlLogKey = queryParams.get("key") || queryParams.get("logKey");

        const storedName = LocalStorage.getUsername();
        setUsername(storedName ?? "");

        const storedLogKey = LocalStorage.getLogKey();
        setLogKey(urlLogKey || storedLogKey || "");

        const storedPaperFirst = LocalStorage.getPaperFirst();
        setPaperFirst(storedPaperFirst);

        const storedMusicVolume = LocalStorage.getMusicVolume(20);
        setMusicVolume(storedMusicVolume);

        const storedSoundVolume = LocalStorage.getSoundVolume(20);
        setSoundVolume(storedSoundVolume);
    }, []);

    return (
        <div className={`journal-stream transition-all duration-1000 ${isLeaving ? "opacity-0" : "opacity-100"}`}>
            <div className="notebook-panel rounded-[12px] p-[2vh] flex flex-col gap-[1.5vh] fade">
                <div className="flex gap-[1.5vh] w-full items-end">
                    <label className="flex flex-col gap-[0.6vh] flex-1">
                        <span className="ink-body">Usuari</span>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your name"
                            autoFocus
                            className="rounded-lg border-amber-800/30 border-2 bg-amber-50/40 px-[2vh] py-[1vh] focus:outline-none focus:ring-2 focus:ring-amber-700/40"
                        />
                    </label>

                    <label className="flex flex-col gap-[0.6vh] justify-center items-center cursor-pointer pb-[0.5vh]">
                        <span className="ink-body">[TextMissing]</span>
                        <input
                            type="checkbox"
                            checked={paperFirst}
                            onChange={(e) => setPaperFirst(e.target.checked)}
                            className="w-[5vh] h-[5vh] rounded border-amber-800/30 border-2 bg-amber-50/40 accent-amber-800 cursor-pointer"
                        />
                    </label>
                </div>

                <label className="flex flex-col gap-[0.6vh]">
                    <span className="ink-body">Contrasenya</span>
                    <input
                        type="text"
                        value={logKey}
                        readOnly
                        className={`rounded-lg border-amber-800/30 border-2 bg-amber-50/40 px-[2vh] py-[1vh] focus:outline-none focus:ring-2 focus:ring-amber-700/40 cursor-not-allowed transition-opacity ${logKey ? "opacity-40" : "opacity-70"}`}
                    />
                </label>

                <label className="flex flex-col gap-[0.8vh] bg-amber-100/45 p-[1.5vh] rounded-[1.5vh] border border-amber-800/20">
                    <div className="flex items-center justify-between px-1">
                        <span className="ink-body font-semibold">Música </span>
                        <span className="text-amber-900 font-bold bg-amber-50 px-[1.5vh] py-[0.2vh] rounded-full text-[2.1vh]">{musicVolume}%</span>
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={musicVolume}
                        onChange={(e) => {
                            const volume = Number(e.target.value);
                            setMusicVolume(volume);
                            LocalStorage.setMusicVolume(volume);
                        }}
                        onMouseUp={() => {
                            void Sound.startMusic();
                        }}
                        className="w-full h-[1vh] bg-amber-900/20 rounded-lg appearance-none cursor-pointer accent-amber-800"
                    />
                </label>

                <label className="flex flex-col gap-[0.8vh] bg-amber-100/45 p-[1.5vh] rounded-[1.5vh] border border-amber-800/20">
                    <div className="flex items-center justify-between px-1">
                        <span className="ink-body font-semibold">Efectes de so</span>
                        <span className="text-amber-900 font-bold bg-amber-50 px-[1.5vh] py-[0.2vh] rounded-full text-[2.1vh]">{soundVolume}%</span>
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={soundVolume}
                        onChange={(e) => {
                            const volume = Number(e.target.value);
                            setSoundVolume(volume);
                            LocalStorage.setSoundVolume(volume);
                        }}
                        onMouseUp={() => {
                            void Sound.playSfx();
                        }}
                        className="w-full h-[1vh] bg-amber-900/20 rounded-lg appearance-none cursor-pointer accent-amber-800"
                    />
                </label>
            </div>
            
            <div className="pt-[0.4vh] flex justify-end fade">
                <button
                    type="button"
                    onClick={onContinue}
                    disabled={username.trim() === "" || logKey.trim() === "" || isLeaving}
                    className="me-[2vh] pencil-btn rounded-full px-[6vh] py-[1.2vh] shadow-lg active:border-b-0 
                    :translate-y-[0.6vh] font-bold text-[2.4vh] hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Comença a escriure
                </button>
            </div>
        </div>
    );
}
