import {useEffect, useRef, useState, type ReactNode} from "react";
import {useTranslation} from "react-i18next";
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
    const {t} = useTranslation();
    const [displayIndicator, setDisplayIndicator] = useState(true);
    const [entries, setEntries] = useState<ReactNode[]>([]);
    const [displayOptions, setDisplayOptions] = useState(false);

    const indexRef = useRef(-1);
    const optionsStartRef = useRef<number | null>(null);

    function escapeRegex(value: string) {
        return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    function renderSentence(text: string): ReactNode {
        const translatedText = t(text);
        if (!scene.hints) {
            return <span>{translatedText}</span>;
        }

        const hints = scene.hints;
        const keys = Object.keys(hints);
        if (keys.length === 0) {
            return <span>{translatedText}</span>;
        }

        const regex = new RegExp(`\\b(${keys.map(escapeRegex).join("|")})\\b`, "gi");
        const parts = translatedText.split(regex);

        return (
            <>
                {parts.map((part, i) => {
                    const lowPart = part.toLowerCase().trim();
                    // We need to find the key in hints that matches (case-insensitive and trimming spaces)
                    const hintKey = keys.find(k => k.toLowerCase().trim() === lowPart);
                    if (hintKey && hints[hintKey]) {
                        return (
                            <span
                                key={i}
                                className="custom-tooltip"
                                data-tooltip={t(hints[hintKey])}
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

    const advanceStory = () => {
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

    const onSpacePress = async (event: KeyboardEvent) => {
        if (event.key !== " ") return;

        event.preventDefault();
        advanceStory();
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

    // Re-render entries when language changes to update translations and hints
    useEffect(() => {
        if (indexRef.current >= 0) {
            const currentSentences = scene.sentences.slice(0, indexRef.current + 1);
            setEntries(currentSentences.map(s => renderSentence(s)));
        }
    }, [t]);
    
    return (
        <div className="journal-stream">
            {entries.map((entry, index) => (
                <div key={index} className="chat-bubble short-fade">
                    {entry}
                </div>
            ))}

            {displayIndicator && active && (
                <button
                    type="button"
                    className="choice-btn rounded-[1vh] px-[3vh] py-[1vh] shadow-md hover:shadow-lg hover:cursor-pointer short-fade mx-auto block"
                    onClick={advanceStory}
                >
                    {t("pressSpaceToContinue")}
                </button>
            )}

            {displayOptions && active && (
                <div className="w-full flex flex-col items-center gap-[1vh] mt-[0.5vh]">
                    {(scene.nextNodeOptions ?? []).slice(0, 4).map((opt, i) => (
                        <button
                            key={opt.nodeName + i}
                            type="button"
                            className="choice-btn w-full sm:w-2/3 rounded-[1vh] p-[1.2vh] shadow-md hover:shadow-lg text-center hover:cursor-pointer short-fade"
                            onClick={() => makeChoice(opt.nodeName)}
                        >
                            {t(opt.displayText)}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
