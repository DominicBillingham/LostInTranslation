import {useEffect, useRef, useState, type ReactNode, type RefObject} from "react";
import type {StorageAPI} from "@/Managers/LocalStorage.ts";
import type {Scene} from "@/Interfaces.ts";

interface InteractiveStoryProps {
    sceneRef?: RefObject<Scene>;
    navigateToNode: any;
    LocalStorage: StorageAPI;
}

export default function InteractiveStory({sceneRef, navigateToNode, LocalStorage}: InteractiveStoryProps) {
    const [displayIndicator, setDisplayIndicator] = useState(true)
    const [refreshAnimations, setRefreshAnimations] = useState(0);

    const [text, setText] = useState<ReactNode>("");
    const [displayOptions, setDisplayOptions] = useState(false);
    const indexRef = useRef(0);
    const optionsStartRef = useRef<number | null>(null);
    const textBoxBottomClass = displayOptions ? 'bottom-[20vh]' : 'bottom-[10v]';

    const OnSpacePress = async (event) => {
        
        event.preventDefault();
        
        if (event.key === ' ') {
            
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
                    
                    if (sceneRef.current.nextNodeOptions.length > 0) {
                        setDisplayOptions(true);
                        // Start timing as soon as options are populated/displayed
                        optionsStartRef.current = (typeof performance !== 'undefined' ? performance.now() : Date.now());
                        return;
                    }
                    
                }
            }
        }
    };

    useEffect(() => {
        
        indexRef.current = 0;
        setDisplayIndicator(true);
        setDisplayOptions(false);
        optionsStartRef.current = null;
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
        // Compute elapsed time since options appeared
        const now = (typeof performance !== 'undefined' ? performance.now() : Date.now());
        const started = optionsStartRef.current;
        const elapsed = started != null ? Math.max(0, Math.round(now - started)) : null;
        
        // Send measured time (falls back to null if not available)
        void LocalStorage.logStoryChoice({decision: sceneRef.current.storyDecision, choice: choice, timeMs: elapsed ?? undefined});
        
        // Clear timer immediately after logging
        optionsStartRef.current = null;
        setDisplayOptions(false);
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
            <div className="inset-x-[3vh] bottom-[3vh] absolute ">

                <div
                    id="storyTextBox"
                    className={`relative bg-white/90 rounded-[1vh] p-[1vh] ps-[2vh] text-gray-800 h-[10vh] shadow-md fade2 transition-all duration-500 ease-out transform`}
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

                {displayOptions && (
                    <div className={`grid grid-cols-2 gap-[1vh] mt-[1vh]`}>
                        {(sceneRef.current?.nextNodeOptions ?? []).slice(0, 4).map((opt, i) => (
                            <button
                                key={opt + i}
                                type="button"
                                className="bg-orange-100/95 rounded-[1vh] p-[1vh] pl-3 text-gray-900 shadow-md hover:shadow-lg  border-[#FF7F50] border-3 text-left hover:cursor-pointer hover:bg-orange-200/95 fade "
                                onClick={() => MakeChoice(opt)}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            
        </>
    )
}