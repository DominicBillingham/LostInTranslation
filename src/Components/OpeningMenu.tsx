import {useEffect, useState} from "react";
import LostInTranslation from "@/Components/LostInTranslation.tsx";
import Sound from "@/Managers/SoundManager.ts";
import LocalStorage from "@/Managers/LocalStorage.ts";

export default function OpeningMenu() {

    const [gameStarted, setGameStarted] = useState(false);
    const [username, setUsername] = useState<string>("");
    const [logKey, setLogKey] = useState<string>("");
    const [musicVolume, setMusicVolume] = useState<number>(20);
    const [isLeaving, setIsLeaving] = useState<boolean>(false);

    async function onContinue() {

        LocalStorage.setUsername(username.trim());
        LocalStorage.setMusicVolume(musicVolume);
        LocalStorage.setLogKey(logKey);

        setIsLeaving(true);
        await new Promise(resolve => setTimeout(resolve, 1350));

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

    }, []);

    return (

        <div className="font-medium custom-font text-[2.5vh] overflow-hidden">

            <div className="story-column max-w-[calc(100vh*(6/5))] m-auto h-[95vh] mt-[2.5vh]">
                <div className="notebook-page pt-[2vh] h-full flex flex-col">
                    <h1 className="text-[4.4vh] font-bold text-center ink-title">
                        Lost In Translation
                    </h1>
                    <div className="border-b border-2 border-amber-800/20 w-1/2 mx-auto my-[0.5vh]"></div>
                    <div className="text-center ink-body px-[2vh]">
                        <span>
                              Press space to continue. 
                                <br />
                                Words{' '}
                                <span className="text-coral custom-tooltip" data-tooltip="Just like this!">
                                highlighted
                                </span>{' '}
                                give a hint when hovered over.
                                <br/>
                        </span>
                    </div>

                    <div className="relative mt-[3vh] flex-1 min-h-0">

                        {gameStarted &&
                            <LostInTranslation LocalStorage={LocalStorage}/>
                        }

                        {!gameStarted &&
                            <>
                                {/* Background start image to mirror main game layout */}
                                <img
                                    src={`${import.meta.env.BASE_URL}start.jpg`}
                                    alt="Start"
                                    className="w-full rounded-b-[24px] object-cover select-none relative h-full saturate-75"
                                />

                                {/* Overlay options card */}
                                <div
                                    className={`absolute backdrop-blur-sm inset-x-[3vh] bottom-[3vh] notebook-panel p-[3vh] px-[5vh] rounded-[16px] text-gray-800 z-10 transition-all duration-500 ease-out transform ${isLeaving ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'}`}
                                >
                                    
                                    <div className="flex flex-col gap-[2vh]">

                                        <div className="flex flex-col md:flex-row gap-[2vh]">
                                            <label className="flex flex-col gap-[1vh] flex-1">
                                                <span className="ink-body">Username </span>
                                                <input
                                                    type="text"
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                    placeholder="Enter your name"
                                                    autoFocus
                                                    className="rounded-lg border-amber-800/30 border-2 bg-amber-50/40 px-[2vh] py-[1vh] focus:outline-none focus:ring-2 focus:ring-amber-700/40"
                                                />
                                            </label>

                                            <label className="flex flex-col gap-[1vh] flex-1">
                                                <span className="ink-body">LogKey <span
                                                    className="text-amber-800/50">(optional)</span></span>
                                                <input
                                                    type="text"
                                                    value={logKey}
                                                    onChange={(e) => {
                                                        setLogKey(e.target.value);
                                                    }}
                                                    placeholder="Enter your LogKey (optional)"
                                                    className="rounded-lg border-amber-800/30 border-2 bg-amber-50/40 px-[2vh] py-[1vh] focus:outline-none focus:ring-2 focus:ring-amber-700/40"
                                                />
                                            </label>
                                        </div>

                                        <label className="flex flex-col gap-[1vh] bg-amber-100/45 p-[2vh] rounded-[2vh] border border-amber-800/20">
                                            <div className="flex items-center justify-between px-1">
                                                <span className="ink-body font-semibold">Music Volume</span>
                                                <span className="text-amber-900 font-bold bg-amber-50 px-[1.5vh] py-[0.2vh] rounded-full text-[2.5vh]">{musicVolume}%</span>
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

                                        <div className="pt[2vh] flex justify-center py-[1.2vh]">
                                            <button
                                                type="button"
                                                onClick={onContinue}
                                                disabled={username.trim() === "" || isLeaving}
                                                className="pencil-btn rounded-full px-[8vh] py-[1.5vh] shadow-lg active:border-b-0 active:translate-y-[0.6vh] transition-all font-bold text-[2.5vh] hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Continue
                                                </button>
                                            </div>
                                        
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>


        </div>
    )
}
