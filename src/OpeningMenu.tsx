import {useEffect, useState} from "react";
import LostInTranslation from "./LostInTranslation.tsx";
import Sound from "./SoundManager.ts";
import LocalStorage from "./LocalStorage.ts";

export default function OpeningMenu() {

    const [gameStarted, setGameStarted] = useState(false);
    const [username, setUsername] = useState<string>("");
    const [musicVolume, setMusicVolume] = useState<number>(20);
    const [isLeaving, setIsLeaving] = useState<boolean>(false);

    async function onContinue() {

        LocalStorage.setUsername(username.trim());
        LocalStorage.setMusicVolume(musicVolume);

        setIsLeaving(true);
        await new Promise(resolve => setTimeout(resolve, 1350));

        void Sound.startMusic();
        setGameStarted(true);
    }

    useEffect(() => {

        const storedName = LocalStorage.getUsername();
        setUsername(storedName ?? " ");
        const storedMusicVolume = LocalStorage.getMusicVolume(20);
        setMusicVolume(storedMusicVolume);

    }, []);

    return (

        <div className="font-medium custom-font text-[2.5vh] overflow-hidden">

            <div className="story-column max-w-[calc(100vh*(6/5))] m-auto h-[95vh] mt-[2.5vh]">
                <div className="bg-white rounded-[2vh] shadow pt-[2vh] h-full flex flex-col">
                    <h1 className="text-[4.5vh] font-bold text-center text-gray-800">
                        Lost In Translation
                    </h1>
                    <div className="border-b border-gray-300 w-1/2 mx-auto my-[1vh]"></div>
                    <div className="text-center text-gray-600 px-[2vh]">
                        <span>
                              When you see ▼ press space to continue. Words{' '}
                                <span className="text-coral custom-tooltip" data-tooltip="Just like this!">
                                highlighted
                                </span>{' '}
                                give a hint when hovered over.
                                <br/>
                              When you are presented with a choice, click on the sentence you prefer to choose!
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
                                    className="w-full rounded-b-xl object-cover select-none relative h-full"
                                />

                                {/* Overlay options card */}
                                <div
                                    className={`absolute inset-x-[3vh] bottom-[3vh] bg-white p-[3vh] px-[5vh] rounded-xl  text-gray-800 shadow-md z-10 transition-all duration-500 ease-out transform ${isLeaving ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'}`}
                                >
                                    
                                    <div className="flex flex-col gap-[2vh]">
                                        
                                        <label className="flex flex-col gap-[1vh]">
                                            <span className=" text-gray-700">Username </span>
                                            <input
                                                type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                placeholder="Enter your name"
                                                autoFocus
                                                className="rounded-lg border border-gray-300 px-[2vh] py-[1vh] focus:outline-none focus:ring-2 focus:ring-orange-300"
                                            />
                                        </label>

                                        <label className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-700">Music</span>
                                                <span className=" text-gray-500">{musicVolume}%</span>
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
                                                className="w-full accent-[#FF7F50]"
                                            />
                                        </label>

                                        <div className="pt[2vh] flex justify-center py-[1.2vh]">
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
                            </>
                        }
                    </div>
                </div>
            </div>


        </div>
    )
}