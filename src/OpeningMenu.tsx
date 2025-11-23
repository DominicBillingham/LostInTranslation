import {useEffect, useState} from "react";
import LostInTranslation from "./LostInTranslation.tsx";
import Sound from "./SoundManager.ts";


export default function Options() {
    
    
    const [gameStarted , setGameStarted] = useState(false);
    const [username, setUsername] = useState<string>("");
    // Default volumes to 20%
    const [soundVolume, setSoundVolume] = useState<number>(20);
    const [musicVolume, setMusicVolume] = useState<number>(20);
    const [isLeaving, setIsLeaving] = useState<boolean>(false);

    useEffect(() => {
        // Load prefs from localStorage (with sensible defaults)
        try {
            const storedName = localStorage.getItem("lit.username");
            if (storedName && storedName.trim() !== "") {
                setUsername(storedName);
            }

            const s = Number(localStorage.getItem("lit.soundVolume"));
            const m = Number(localStorage.getItem("lit.musicVolume"));

            const validS = Number.isNaN(s) ? 20 : Math.max(0, Math.min(100, s));
            const validM = Number.isNaN(m) ? 20 : Math.max(0, Math.min(100, m));

            setSoundVolume(validS);
            setMusicVolume(validM);

            // Apply to Sound engine
            Sound.setSoundVolume(validS);
            Sound.setMusicVolume(validM);

            // If no values were stored previously, persist defaults for next time
            if (Number.isNaN(s)) localStorage.setItem("lit.soundVolume", String(validS));
            if (Number.isNaN(m)) localStorage.setItem("lit.musicVolume", String(validM));
        } catch {}

    }, []);

    async function onContinue() {
        const name = username.trim();
        if (!name) return;
        try {
            // Persist simple preferences for later use (optional, non-breaking)
            localStorage.setItem("lit.username", name);
            localStorage.setItem("lit.soundVolume", String(soundVolume));
            localStorage.setItem("lit.musicVolume", String(musicVolume));
            // Increment playthrough attempts counter
            const attemptsRaw = localStorage.getItem("lit.playthroughAttempts");
            const attempts = Number.isNaN(Number(attemptsRaw)) ? 0 : parseInt(attemptsRaw ?? "0", 10);
            localStorage.setItem("lit.playthroughAttempts", String((attempts || 0) + 1));
        } catch (e) {
            // Ignore storage errors silently
        }
        // Click feedback and start looping music (will fail gracefully if asset missing)
        await Sound.playClick();
        void Sound.startMusic();
        // Trigger exit animation then start game
        setIsLeaving(true);
        await new Promise(resolve => setTimeout(resolve, 1350));
        setGameStarted(true);
    }

    return (

        <div className="flex flex-col md:flex-row gap-4 p-4 main-container justify-center m-1 font-medium custom-font text-xl">

            {gameStarted &&
                <LostInTranslation/>
            }
            
            {!gameStarted &&
                <div className="flex-1 story-column max-w-[calc(100vh*(6/5))]  ">
                    <div className="bg-white rounded-xl shadow pt-4">
                        <h1 className="text-3xl font-bold text-center pb-1 text-gray-800">
                            Lost In Translation
                        </h1>
                        <div className="border-b border-gray-300 w-1/2 mx-auto  my-2"></div>
                        <div className="text-center text-gray-600">
                        <span>
                          When you see ▼ press space to continue. Words{' '}
                            <span className="text-coral custom-tooltip" data-tooltip="Just like this!">
                            highlighted
                          </span>{' '}
                            give a hint when hovered over. <br/>
                          When you are presented with a choice, click on the sentence you prefer to choose!
                        </span>
                        </div>
                        
                        <div className="relative mt-4 text-xl h-[calc(100vh-220px)]">
                            {/* Background start image to mirror main game layout */}
                            <img
                                src="/start.jpg"
                                alt="Start"
                                className="w-full rounded-b-xl object-cover select-none relative h-[calc(100vh-220px)]"
                            />

                            {/* Overlay options card */}
                            <div
                                className={`absolute inset-x-[160px] bottom-[160px] bg-white p-8 rounded-xl  text-gray-800 shadow-md z-10 text-1xl transition-all duration-500 ease-out transform ${isLeaving ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'}`}
                            >

                                {/* Welcome */}
                                <label className="flex flex-col gap-2 ">
                                    <span className="text-2xl text-gray-800">Welcome!</span>
                                    <span className="text-gray-600 text-md ">
                                          Lost in Translation is a new, immersive way to learn languages. Choose a username and get started! Please note, username and story choices are logged. 
                                        </span>
                                </label>
                                
                                <br/>
                                
                                <div className="flex flex-col gap-4">
                                    {/* Username */}
                                    <label className="flex flex-col gap-2">
                                        <span className="text-lg text-gray-700">Username </span>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder="Enter your name"
                                            autoFocus
                                            className="rounded-lg border border-gray-300 px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                                        />
                                    </label>

                                    {/* Sound slider */}
                                    {/*<label className="flex flex-col gap-2">*/}
                                    {/*    <div className="flex items-center justify-between">*/}
                                    {/*        <span className="text-lg text-gray-700">Sound</span>*/}
                                    {/*        <span className="text-lg text-gray-500">{soundVolume}%</span>*/}
                                    {/*    </div>*/}
                                    {/*    <input*/}
                                    {/*        type="range"*/}
                                    {/*        min={0}*/}
                                    {/*        max={100}*/}
                                    {/*        step={1}*/}
                                    {/*        value={soundVolume}*/}
                                    {/*        onChange={(e) => {*/}
                                    {/*            const v = Number(e.target.value);*/}
                                    {/*            setSoundVolume(v);*/}
                                    {/*            Sound.setSoundVolume(v);*/}
                                    {/*        }}*/}
                                    {/*        onMouseUp={() => { void Sound.playClick(); }}*/}
                                    {/*        onTouchEnd={() => { void Sound.playClick(); }}*/}
                                    {/*        className="w-full accent-[#FF7F50]"*/}
                                    {/*    />*/}
                                    {/*</label>*/}

                                    {/* Music slider */}
                                    <label className="flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg text-gray-700">Music</span>
                                            <span className="text-lg text-gray-500">{musicVolume}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min={0}
                                            max={100}
                                            step={1}
                                            value={musicVolume}
                                            onChange={(e) => {
                                                const v = Number(e.target.value);
                                                setMusicVolume(v);
                                                Sound.setMusicVolume(v);
                                                try { localStorage.setItem("lit.musicVolume", String(v)); } catch {}
                                            }}
                                            onMouseUp={() => { void Sound.playClick(); void Sound.startMusic(); }}
                                            onTouchEnd={() => { void Sound.playClick(); void Sound.startMusic(); }}
                                            className="w-full accent-[#FF7F50]"
                                        />
                                    </label>

                                    {/* Continue button */}
                                    <div className="pt-6 flex justify-center py-2">
                                        <button
                                            type="button"
                                            onClick={onContinue}
                                            disabled={username.trim() === "" || isLeaving}
                                            className={`rounded-xl px-10 py-2 text-gray-900 shadow-md border-[#FF7F50] border-3 text-center hover:shadow-lg ${username.trim() === "" || isLeaving ? 'bg-orange-100/10 cursor-not-allowed opacity-60' : 'bg-orange-200/95 hover:bg-orange-300/95 hover:cursor-pointer'}`}
                                        >
                                            Continue
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            
        </div>
    )
}