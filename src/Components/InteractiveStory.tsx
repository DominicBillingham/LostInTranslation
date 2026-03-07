import {useEffect, useRef, useState, type ReactNode, type RefObject} from "react";
import type {StorageAPI} from "@/Managers/LocalStorage.ts";
import type {Scene} from "@/Interfaces.ts";

interface InteractiveStoryProps {
    sceneRef?: RefObject<Scene>;
    navigateToNode: any;
    LocalStorage: StorageAPI;
}

export default function InteractiveStory({sceneRef, navigateToNode, LocalStorage}: InteractiveStoryProps) {
    const [displayIndicator, setDisplayIndicator] = useState(true);
    const [entries, setEntries] = useState<ReactNode[]>([]);
    const [displayOptions, setDisplayOptions] = useState(false);

    const indexRef = useRef(0);
    const optionsStartRef = useRef<number | null>(null);
    const endRef = useRef<HTMLDivElement | null>(null);

    function scrollToBottom() {
        requestAnimationFrame(() => {
            endRef.current?.scrollIntoView({behavior: "smooth", block: "end"});
        });
    }

    function escapeRegex(value: string) {
        return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    function renderSentence(text: string): ReactNode {
        if (!sceneRef.current || !sceneRef.current.hints) {
            return <span>{text}</span>;
        }

        const hints = sceneRef.current.hints;
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

        if (!sceneRef.current || displayOptions) return;

        const sentences = sceneRef.current.sentences;
        if (indexRef.current < sentences.length - 1) {
            indexRef.current += 1;
            const nextSentence = sentences[indexRef.current];
            setEntries(prev => [...prev, renderSentence(nextSentence)]);
            scrollToBottom();

            if (indexRef.current === sentences.length - 1) {
                setDisplayIndicator(false);

                if (sceneRef.current.quizName) {
                    navigateToNode(sceneRef.current.quizName);
                    return;
                }

                if ((sceneRef.current.nextNodeOptions ?? []).length > 0) {
                    setDisplayOptions(true);
                    optionsStartRef.current = (typeof performance !== "undefined" ? performance.now() : Date.now());
                    scrollToBottom();
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
            setEntries([renderSentence(firstSentence)]);
        } else {
            setEntries([]);
        }

        window.addEventListener("keydown", onSpacePress);
        return () => window.removeEventListener("keydown", onSpacePress);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [entries, displayOptions]);

    async function makeChoice(choice: string) {
        const now = (typeof performance !== "undefined" ? performance.now() : Date.now());
        const started = optionsStartRef.current;
        const elapsed = started != null ? Math.max(0, Math.round(now - started)) : null;

        void LocalStorage.logStoryChoice({decision: sceneRef.current.storyDecision, choice: choice, timeMs: elapsed ?? undefined});

        optionsStartRef.current = null;
        setDisplayOptions(false);
        navigateToNode(choice);
    }

    return (
        <div className="journal-stream grow">
            {entries.map((entry, index) => (
                <div key={index} className="chat-bubble fade2">
                    {entry}
                </div>
            ))}

            {displayIndicator && (
                <div className="ink-body text-[2.1vh] italic px-[0.5vh]">
                    Press space to continue...
                </div>
            )}

            {displayOptions && (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-[1vh] mt-[0.5vh]">
                    {(sceneRef.current?.nextNodeOptions ?? []).slice(0, 4).map((opt, i) => (
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

            <div ref={endRef}></div>
        </div>
    );
}
