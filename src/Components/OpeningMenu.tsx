import {useEffect, useState} from "react";
import LostInTranslation from "@/Components/LostInTranslation.tsx";
import Introduction from "@/Components/Introduction.tsx";
import Sound from "@/Managers/SoundManager.ts";
import LocalStorage from "@/Managers/LocalStorage.ts";

export default function OpeningMenu() {
    const [introCompleted, setIntroCompleted] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [username, setUsername] = useState<string>("");
    const [logKey, setLogKey] = useState<string>("");
    const [musicVolume, setMusicVolume] = useState<number>(20);
    const [soundVolume, setSoundVolume] = useState<number>(20);
    const [isLeaving, setIsLeaving] = useState<boolean>(false);

    async function onContinue() {
        LocalStorage.setUsername(username.trim());
        LocalStorage.setMusicVolume(musicVolume);
        LocalStorage.setSoundVolume(soundVolume);
        LocalStorage.setLogKey(logKey);

        void Sound.playSfx();
        setIsLeaving(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        void Sound.startMusic();
        setGameStarted(true);
    }

    useEffect(() => {
        const storedName = LocalStorage.getUsername();
        setUsername(storedName ?? "");

        const storedLogKey = LocalStorage.getLogKey();
        setLogKey(storedLogKey ?? "");

        const storedMusicVolume = LocalStorage.getMusicVolume(20);
        setMusicVolume(storedMusicVolume);

        const storedSoundVolume = LocalStorage.getSoundVolume(20);
        setSoundVolume(storedSoundVolume);
    }, []);

    return (
        <div className="font-medium custom-font text-[2.5vh] min-h-screen">
            
            <div className="story-column max-w-[min(94vw,92vh)] m-auto py-[2.5vh]">
                
                <div className="notebook-page pt-[2vh] min-h-[95vh] flex flex-col">
                    
                    <div className="mt-[1.5vh] px-[1.5vh] pb-[1.5vh]">
                        {gameStarted ? (
                            <LostInTranslation />
                        ) : (
                            <>
                                {!introCompleted && <Introduction onComplete={() => setIntroCompleted(true)} />}
                                {introCompleted && (
                                    <div className={`journal-stream transition-all duration-1000 ${isLeaving ? "opacity-0" : "opacity-100"}`}>
                                        <div className="mb-[2vh] fade">
                                            <div className="prata-regular tracking-wide text-center text-[8vh] font-bold  leading-[1.1] uppercase">
                                                <div>Lost <span className="text-[5.5vh] align-baseline">in</span></div>
                                                <div>Translation</div>
                                            </div>
                                            <div className="border-b border-2 border-amber-800/20 w-1/2 mx-auto my-[0.2vh]"></div>
                                        </div>

                                        <div className="notebook-panel rounded-[1.5vh] p-[2vh] flex flex-col gap-[1.3vh]">
                                            <label className="flex flex-col gap-[0.6vh]">
                                                <span className="ink-body">Username</span>
                                                <input
                                                    type="text"
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                    placeholder="Enter your name"
                                                    autoFocus
                                                    className="rounded-lg border-amber-800/30 border-2 bg-amber-50/40 px-[2vh] py-[1vh] focus:outline-none focus:ring-2 focus:ring-amber-700/40"
                                                />
                                            </label>
        
                                            <label className="flex flex-col gap-[0.6vh]">
                                                <span className="ink-body">Log Key <span className="text-amber-800/50">(optional)</span></span>
                                                <input
                                                    type="text"
                                                    value={logKey}
                                                    onChange={(e) => setLogKey(e.target.value)}
                                                    placeholder="Enter a log key so we can gather data on story decisions!"
                                                    className="rounded-lg border-amber-800/30 border-2 bg-amber-50/40 px-[2vh] py-[1vh] focus:outline-none focus:ring-2 focus:ring-amber-700/40"
                                                />
                                            </label>
        
                                            <label className="flex flex-col gap-[0.8vh] bg-amber-100/45 p-[1.5vh] rounded-[1.5vh] border border-amber-800/20">
                                                <div className="flex items-center justify-between px-1">
                                                    <span className="ink-body font-semibold">Music Volume</span>
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
                                                    <span className="ink-body font-semibold">SFX Volume</span>
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
                                        
                                        <div className="pt-[0.4vh] flex justify-end">
                                            <button
                                                type="button"
                                                onClick={onContinue}
                                                disabled={username.trim() === "" || isLeaving}
                                                className="me-[2vh] pencil-btn rounded-full px-[6vh] py-[1.2vh] shadow-lg active:border-b-0 active:translate-y-[0.6vh] font-bold text-[2.4vh] hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Start Writing
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
