import { type ReactNode } from "react";
import { HintManager } from "@/Managers/HintManager";

export function escapeRegex(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function renderSentenceWithHints(translatedText: string): ReactNode {
    const hints = HintManager.getHints();
    const keys = Object.keys(hints);
    
    if (keys.length === 0) {
        return <span>{translatedText}</span>;
    }

    // Build regex to find hints in the translated text
    // Using word boundaries to avoid matching parts of words
    const regex = new RegExp(`\\b(${keys.map(escapeRegex).join("|")})\\b`, "gi");
    const parts = translatedText.split(regex);

    return (
        <>
            {parts.map((part, i) => {
                const lowPart = part.toLowerCase().trim();
                // Find the key in hints that matches (case-insensitive and trimming spaces)
                const hintKey = keys.find(k => k.toLowerCase().trim() === lowPart);
                
                if (hintKey && hints[hintKey]) {
                    return (
                        <span
                            key={i}
                            className="custom-tooltip"
                            data-tooltip={(hints[hintKey])}
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
