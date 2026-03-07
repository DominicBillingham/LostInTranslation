import {useEffect, useRef, useState} from "react";
import {type StorageAPI} from "@/Managers/LocalStorage.ts";
import InteractiveStory from "@/Components/InteractiveStory.tsx";
import InteractiveQuiz from "@/Components/InteractiveQuiz.tsx";
import type {Quiz, Scene} from "@/Interfaces.ts";

type TimelineItem =
    | { id: number; type: "image"; src: string }
    | { id: number; type: "scene"; scene: Scene; active: boolean }
    | { id: number; type: "quiz"; quiz: Quiz; active: boolean };

function LostInTranslation({LocalStorage}: { LocalStorage?: StorageAPI }) {
    
    // This game functions via a series of JSON nodes.
    // Each node is either a chapter, a quiz, or a minigame.
    // A node can then point to any other node in JSON, allowing for things to easily be stringed together.
    // This is the high-level component that manages the state.
    
    const startingImage = "start.jpg";
    const nextIdRef = useRef(1);
    const endRef = useRef<HTMLDivElement | null>(null);
    const [timeline, setTimeline] = useState<TimelineItem[]>([]);

    async function fetchSceneFromJson(sceneName: string): Promise<Scene | null> {
        const response = await fetch("adventure.json");
        const json: Scene[] = await response.json();
        return json.find(s => s.nodeName === sceneName) ?? null;
    }

    async function fetchQuizFromJson(quizName: string): Promise<Quiz | null> {
        const response = await fetch("quiz.json");
        const json: Quiz[] = await response.json();
        return json.find(q => q.nodeName === quizName) ?? null;
    }

    const resetKeyEvent = (event: KeyboardEvent) => {
        if (event.key === "r") {
            event.preventDefault();
            void resetGame();
        }
    };

    function scrollToBottom() {
        requestAnimationFrame(() => {
            endRef.current?.scrollIntoView({behavior: "smooth", block: "end"});
        });
    }

    async function resetGame() {
        LocalStorage?.incrementPlaythroughAttempts();
        const introScene = await fetchSceneFromJson("Intro");
        
        nextIdRef.current = 1;
        const newTimeline: TimelineItem[] = [
            {id: nextIdRef.current++, type: "image", src: `${import.meta.env.BASE_URL}${startingImage}`},
        ];

        if (introScene) {
            newTimeline.push({id: nextIdRef.current++, type: "scene", scene: introScene, active: true});
        }

        setTimeline(newTimeline);
    }

    useEffect(() => {
        void resetGame();
        window.addEventListener("keydown", resetKeyEvent);
        return () => window.removeEventListener("keydown", resetKeyEvent);
    }, []);

    async function navigateToNode(nodeName: string) {
        
        const nextScene = await fetchSceneFromJson(nodeName);
        const nextQuiz = await fetchQuizFromJson(nodeName);
        const image = nextScene?.image;
        
        setTimeline(prev => {
            const updated = prev.map((entry) => {
                if ((entry.type === "scene" || entry.type === "quiz") && entry.active) {
                    return {...entry, active: false};
                }
                return entry;
            });

            if (image) {
                updated.push({id: nextIdRef.current++, type: "image", src: `${import.meta.env.BASE_URL}${image}`});
            }

            if (nextQuiz) {
                updated.push({id: nextIdRef.current++, type: "quiz", quiz: nextQuiz, active: true});
                return updated;
            }

            if (nextScene) {
                updated.push({id: nextIdRef.current++, type: "scene", scene: nextScene, active: true});
            }

            return updated;
        });
        scrollToBottom();
    }

    return (
        
        <div className="journal-stream journal-root">
            {timeline.map((entry) => {
                
                if (entry.type === "image") {
                    return (
                        <div key={entry.id} className="photo-frame rounded-[18px] h-[24vh] w-[92%] mx-auto shrink-0 fade2">
                            <img
                                src={entry.src}
                                alt="Story"
                                className="w-full h-full rounded-[14px] object-cover select-none saturate-75 blur-[0.75px]"
                            />
                        </div>
                    );
                }

                if (entry.type === "scene") {
                    return (
                        <InteractiveStory
                            key={entry.id}
                            scene={entry.scene}
                            active={entry.active}
                            navigateToNode={navigateToNode}
                            LocalStorage={LocalStorage}
                            onContentUpdate={scrollToBottom}
                        />
                    );
                }

                return (
                    <InteractiveQuiz
                        key={entry.id}
                        quiz={entry.quiz}
                        active={entry.active}
                        navigateToNode={navigateToNode}
                        LocalStorage={LocalStorage}
                        onContentUpdate={scrollToBottom}
                    />
                );

            })}

            {/* Add a 30vh spacer at the very bottom */}
            <div ref={endRef} className="h-[25vh] w-full shrink-0" />
            
        </div>
    );
}

export default LostInTranslation;
