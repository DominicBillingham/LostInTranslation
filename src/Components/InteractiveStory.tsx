import {useEffect, useRef, useState, type ReactNode} from "react";
import LocalStorage, {type StorageAPI, StorageManager} from "@/Managers/LocalStorage.ts";
import type {Scene} from "@/Interfaces.ts";
import Sound from "@/Managers/SoundManager.ts";

interface InteractiveStoryProps {
    scene: Scene;
    active: boolean;
    navigateToNode: any;
    onContentUpdate: () => void;
}

export default function InteractiveStory({scene, active, navigateToNode, onContentUpdate}: InteractiveStoryProps) {
    const [displayIndicator, setDisplayIndicator] = useState(true);
    const [entries, setEntries] = useState<ReactNode[]>([]);
    const [displayOptions, setDisplayOptions] = useState(false);

    const indexRef = useRef(-1);
    const optionsStartRef = useRef<number | null>(null);

    function escapeRegex(value: string) {
        return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    function renderSentence(text: string): ReactNode {
        if (!scene.hints) {
            return <span>{text}</span>;
        }

        const hints = scene.hints;
        const keys = Object.keys(hints);
        if (keys.length === 0) {
            return <span>{text}</span>;
        }

        const regex = new RegExp(`\\b(${keys.map(escapeRegex).join("|")})\\b`, "gi");
        const parts = text.split(regex);

        return (
            <>
                {parts.map((part, i) => {
                    const key = part.toLowerCase();
                    if (hints[key]) {
                        return (
                            <span
                                key={i}
                                className="custom-tooltip"
                                data-tooltip={hints[key]}
                            >
                                {part}
                            </span>
                        );
                    }
                    return <span key={i}>{part}</span>;
                })}
            </>
        );
    }

    const onSpacePress = async (event: KeyboardEvent) => {
        if (event.key !== " ") return;

        event.preventDefault();

        if (!active || displayOptions) return;

        const sentences = scene.sentences;
        if (indexRef.current < sentences.length - 1) {
            indexRef.current += 1;
            const nextSentence = sentences[indexRef.current];
            setEntries(prev => [...prev, renderSentence(nextSentence)]);
            onContentUpdate();

            if (indexRef.current === sentences.length - 1) {
                setDisplayIndicator(false);

                if (scene.quizName) {
                    navigateToNode(scene.quizName);
                    return;
                }

                if ((scene.nextNodeOptions ?? []).length > 0) {
                    setDisplayOptions(true);
                    optionsStartRef.current = (typeof performance !== "undefined" ? performance.now() : Date.now());
                    onContentUpdate();
                }
            }
        }
    };
    
    async function makeChoice(choice: string) {
        const now = (typeof performance !== "undefined" ? performance.now() : Date.now());
        const started = optionsStartRef.current;
        const elapsed = started != null ? Math.max(0, Math.round(now - started)) : null;

        void Sound.playSfx();
        void LocalStorage.logStoryChoice({decision: scene.storyDecision, choice: choice, timeMs: elapsed ?? undefined});

        optionsStartRef.current = null;
        setDisplayOptions(false);
        navigateToNode(choice);
    }
    
    useEffect(() => {
        indexRef.current = -1;
        setDisplayIndicator(true);
        setDisplayOptions(false);
        optionsStartRef.current = null;

        setEntries([]);

        window.addEventListener("keydown", onSpacePress);
        return () => window.removeEventListener("keydown", onSpacePress);
    }, []);
    
    return (
        <div className="journal-stream">
            {entries.map((entry, index) => (
                <div key={index} className="chat-bubble fade2">
                    {entry}
                </div>
            ))}

            {displayIndicator && active && (
                <div className="ink-body text-[2.1vh] italic px-[0.5vh] text-center fade">
                    Press space to continue...
                </div>
            )}

            {displayOptions && active && (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-[1vh] mt-[0.5vh]">
                    {(scene.nextNodeOptions ?? []).slice(0, 4).map((opt, i) => (
                        <button
                            key={opt + i}
                            type="button"
                            className="choice-btn rounded-[1vh] p-[1.2vh] shadow-md hover:shadow-lg text-left hover:cursor-pointer fade2"
                            onClick={() => makeChoice(opt)}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
