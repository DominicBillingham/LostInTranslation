import {useEffect, useRef, useState} from "react";
import {type StorageAPI} from "@/Managers/LocalStorage.ts";
import InteractiveStory from "@/Components/InteractiveStory.tsx";
import InteractiveQuiz from "@/Components/InteractiveQuiz.tsx";
import type {Quiz, Scene} from "@/Interfaces.ts";

function LostInTranslation({LocalStorage}: { LocalStorage?: StorageAPI }) {
    const startingImage = "start.jpg";

    const sceneRef = useRef<Scene | null>(null);
    const quizRef = useRef<Quiz | null>(null);
    const lastImageRef = useRef<string>(startingImage);

    const [sceneKey, setSceneKey] = useState(0);
    const [quizKey, setQuizKey] = useState(0);

    const [displayScene, setDisplayScene] = useState(false);
    const [displayQuiz, setDisplayQuiz] = useState(false);
    const [imageFeed, setImageFeed] = useState<string[]>([]);

    async function fetchSceneFromJson(sceneName: string) {
        const response = await fetch("adventure.json");
        const json: Scene[] = await response.json();
        sceneRef.current = json.find(s => s.nodeName === sceneName) ?? null;
    }

    async function fetchQuizFromJson(quizName: string) {
        const response = await fetch("quiz.json");
        const json: Quiz[] = await response.json();
        quizRef.current = json.find(q => q.nodeName === quizName) ?? null;
    }

    const resetKeyEvent = (event: KeyboardEvent) => {
        if (event.key === "r") {
            event.preventDefault();
            void resetGame();
        }
    };

    async function resetGame() {
        LocalStorage?.incrementPlaythroughAttempts();
        await fetchSceneFromJson("Intro");

        setSceneKey(k => k + 1);
        setQuizKey(k => k + 1);

        setDisplayScene(true);
        setDisplayQuiz(false);

        lastImageRef.current = startingImage;
        setImageFeed([`${import.meta.env.BASE_URL}${startingImage}`]);
    }

    useEffect(() => {
        void resetGame();
        setDisplayScene(true);
        window.addEventListener("keydown", resetKeyEvent);
        return () => window.removeEventListener("keydown", resetKeyEvent);
    }, []);

    async function navigateToNode(nodeName: string) {
        await fetchSceneFromJson(nodeName);
        await fetchQuizFromJson(nodeName);

        const image = sceneRef.current?.image;

        if (image && image !== lastImageRef.current) {
            const nextImgPath = `${import.meta.env.BASE_URL}${image}`;
            setImageFeed(prev => [...prev, nextImgPath]);
            lastImageRef.current = image;
        }

        setSceneKey(k => k + 1);
        setQuizKey(k => k + 1);

        if (sceneRef.current) {
            setDisplayScene(true);
            setDisplayQuiz(false);
        }

        if (quizRef.current) {
            setDisplayScene(false);
            setDisplayQuiz(true);
        }
    }

    return (
        <div className="journal-stream">
            {imageFeed.map((imgSrc, index) => (
                <div key={`${imgSrc}-${index}`} className="photo-frame rounded-[18px] h-[24vh] w-[92%] mx-auto shrink-0 fade2">
                    <img
                        src={imgSrc}
                        alt="Story"
                        className="w-full h-full rounded-[14px] object-cover select-none saturate-75"
                    />
                </div>
            ))}
            {displayScene && (
                <InteractiveStory key={sceneKey} sceneRef={sceneRef} navigateToNode={navigateToNode} LocalStorage={LocalStorage} />
            )}
            {displayQuiz && (
                <InteractiveQuiz key={quizKey} quizRef={quizRef} navigateToNode={navigateToNode} LocalStorage={LocalStorage}/>
            )}
        </div>
    );
}

export default LostInTranslation;
