import {useEffect, useRef, useState, type ReactNode, type RefObject} from "react";
import Sound from "./SoundManager.ts";

interface Scene {
    sceneName: string;
    image?: string;
    sentences: string[];
    options?: string[];
    quizName?: string;
    hints?: Record<string, string>;
}

export default function InteractiveStory({ sceneRef, navigateToNode }) {

    const [displayIndicator, setDisplayIndicator] = useState(true)
    const [refreshAnimations, setRefreshAnimations] = useState(0);

    const [text, setText] = useState<ReactNode>("");
    const [displayOptions, setDisplayOptions] = useState(false);
    const indexRef = useRef(0);
    const textBoxBottomClass = displayOptions ? 'bottom-[160px]' : 'bottom-[40px]';

    const OnSpacePress = async (event) => {
        
        if (event.key === ' ') {

            event.preventDefault();

            if (sceneRef.current == null) return;

            const sentences = sceneRef.current.sentences;
            // Advance only if we are NOT on the last sentence
            if (indexRef.current < sentences.length - 1) {
                indexRef.current += 1;
                const nextSentence = sentences[indexRef.current];
                await SetText(nextSentence);

                // If we just reached the last sentence, hide the indicator
                if (indexRef.current === sentences.length - 1) {
                    
                    setDisplayIndicator(false);

                    if (sceneRef.current.quizName) {
                        navigateToNode(sceneRef.current.quizName);
                        return;
                    }
                    
                    if (sceneRef.current.options.length > 0) {
                        setDisplayOptions(true);
                        return;
                    }
                    
                }
            }
        }
        
    };

    useEffect(() => {
        
        indexRef.current = 0;
        setDisplayIndicator(true);
        const firstSentence = sceneRef.current?.sentences?.[0];
        if (firstSentence) {
            void SetText(firstSentence);
        } else {
            setText("");
        }
        
        window.addEventListener("keydown", OnSpacePress);
        return () => window.removeEventListener("keydown", OnSpacePress);
        
        
    }, []);
    
    async function MakeChoice(choice: string) {
        // Play a subtle click for button taps
        void Sound.playClick();
        navigateToNode(choice);
    }
    
    async function SetText(text: string) {
        // If there is no scene or no hints for this scene, render plain text
        if (!sceneRef.current || !sceneRef.current.hints) {
            setText(text);
            return;
        }

        const hints = sceneRef.current.hints;

        // Build a regex matching all hint words (case-insensitive, whole word)
        const regex = new RegExp(`\\b(${Object.keys(hints).join("|")})\\b`, "gi");

        // Split the sentence into React elements
        const parts = text.split(regex);

        const result = parts.map((part, i) => {
            const key = part.toLowerCase();
            if (hints[key]) {
                // If it's a hint word, return highlighted span
                return (
                    <span
                        key={i}
                        className="text-coral custom-tooltip"
                        data-tooltip={hints[key]}
                    >
                        {part}
                    </span>
                );
            }
            // Normal text stays plain
            return <span key={i}>{part}</span>;
        });

        setRefreshAnimations(Math.floor(Math.random() * 5000));
        setText(result)
    }
    
    return (
        <>
            <div
                id="storyTextBox"
                className={`  absolute ${textBoxBottomClass} left-[40px] right-[40px] bg-white/90 rounded-xl p-3 text-gray-800 text-sm sm:text-base md:text-lg h-[80px] shadow-md fade2 transition-all duration-500 ease-out transform`}
            >

                <p className="fade" key={refreshAnimations}>
                    {text}
                </p>

                {displayIndicator &&
                    <div
                        className="absolute bottom-[5px] right-[10px] opacity-100 animate-pulse cursor-pointer select-none"
                    >
                        ▼
                    </div>
                }
            </div>

            {displayOptions && (sceneRef.current?.options?.length ?? 0) > 0 && (
                <div className={`absolute left-[40px] right-[40px] bottom-[37px] grid grid-cols-2 gap-2 z-10`}>
                    {(sceneRef.current?.options ?? []).slice(0, 4).map((opt, i) => (
                        <button
                            key={opt + i}
                            type="button"
                            className="bg-orange-100/95 rounded-xl p-2 pl-3 text-gray-900 text-sm sm:text-base md:text-lg shadow-md hover:shadow-lg  border-[#FF7F50] border-3 text-left hover:cursor-pointer hover:bg-orange-200/95 fade "
                            onClick={() => MakeChoice(opt)}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            )}
        </>
        
    )
    
}