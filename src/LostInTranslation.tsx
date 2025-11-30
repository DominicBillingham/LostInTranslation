import {useEffect, useRef, useState} from "react";
import LocalStorage, { type StorageAPI } from "./LocalStorage.ts";
import InteractiveStory from "./InteractiveStory.tsx";
import InteractiveQuiz from "./InteractiveQuiz.tsx";
import type {Quiz, Scene} from "./Interfaces.ts";

function LostInTranslation({ LocalStorage }: { LocalStorage?: StorageAPI }) {

    const startingImage = "start.jpg";
    
    // Main Containers
    const sceneRef = useRef<Scene | null>(null);
    const quizRef = useRef<Quiz | null>(null);
    const lastImageRef = useRef<string>(startingImage);
    
    async function FetchSceneFromJson(sceneName: string) {
        const response = await fetch("adventure.json");
        const json: Scene[] = await response.json();
        sceneRef.current = json.find(s => s.nodeName === sceneName) ?? null;
    }
    async function FetchQuizFromJson(quizName: string) {
        const response = await fetch("quiz.json");
        const json: Quiz[] = await response.json();
        quizRef.current = json.find(q => q.quizName === quizName) ?? null;
    }
    
    const [sceneKey, setSceneKey] = useState(0);
    const [quizKey, setQuizKey] = useState(0);
    
    const [displayScene, setDisplayScene] = useState(false);
    const [displayQuiz, setDisplayQuiz] = useState(false);
    const [imageHmtl, setImageHmtl] = useState<React.ReactNode>(null);
    
    async function ChangeImages(imageSrc: string, oldImageSrc: string) {
        
        console.log("New Image: "+ imageSrc + " | Old Image: " + oldImageSrc );
        
        const htmlFade = <img
            src={oldImageSrc ?? ""}
            alt="Story"
            className="w-full rounded-b-xl object-cover select-none relative h-full opacity-0 transition-opacity duration-[1500ms]"
        />

        setImageHmtl(htmlFade);

        await new Promise(resolve => setTimeout(resolve, 1500));

        const htmlUnfade = <img
            src={imageSrc ?? ""}
            alt="Story"
            className="w-full rounded-b-xl object-cover select-none relative h-full opacity-100 transition-opacity duration-[1500ms]"
        />

        setImageHmtl(htmlUnfade);
        await new Promise(resolve => setTimeout(resolve, 1500));
    }

    const ResetKeyEvent = async (event) => {
        
        if (event.key === 'r') {
            event.preventDefault();
            ResetGame();
        }
    };
    
    async function ResetGame() {  

        LocalStorage.incrementPlaythroughAttempts();
        await FetchSceneFromJson("Intro");
        
        // Use functional updates to avoid stale closures and ensure key changes
        setSceneKey(k => k + 1);
        setQuizKey(k => k + 1);
        
        // Ensure we are showing the story and hiding the quiz after reset
        setDisplayScene(true);
        setDisplayQuiz(false);
        
        const html = <img
            src={`${import.meta.env.BASE_URL}${startingImage}`}   
            alt="Story"
            className="w-full rounded-b-xl object-cover select-none relative h-full"
        />

        lastImageRef.current = startingImage;
        setImageHmtl(html);
        
    }
    
    useEffect(() => {
        ResetGame();
        setDisplayScene(true);
        window.addEventListener("keydown", ResetKeyEvent);
        return () => window.removeEventListener("keydown", ResetKeyEvent);
    }, []);
    
    async function NavigateToNode(nodeName: string) {
        
        console.log("Navigating to: " + nodeName);
        
        await FetchSceneFromJson(nodeName);
        await FetchQuizFromJson(nodeName);
        
        const image = sceneRef?.current?.image;
         
        if (image) {
            
            setDisplayScene(false);
            setDisplayQuiz(false);
            
            const imgPath1 = `${import.meta.env.BASE_URL}${image}`
            const imgPath2 = `${import.meta.env.BASE_URL}${lastImageRef.current}`

            await ChangeImages(imgPath1, imgPath2);
            lastImageRef.current = image;
        }
        
        setSceneKey(k => k + 1);
        setQuizKey(k => k + 1);

        if (sceneRef.current) {
            console.log(sceneRef.current);
            setDisplayScene(true);
            setDisplayQuiz(false);
        }

        if (quizRef.current) {
            console.log(quizRef.current);
            setDisplayScene(false);
            setDisplayQuiz(true);
        }
    }
    
    return (

        <>
            {imageHmtl}
            {displayScene &&
                <InteractiveStory key={sceneKey} sceneRef={sceneRef} navigateToNode={NavigateToNode} LocalStorage={LocalStorage} />
            }
            {displayQuiz &&
                <InteractiveQuiz key={quizKey} quizRef={quizRef} navigateToNode={NavigateToNode} LocalStorage={LocalStorage}/>
            }
        </>
    )
}

export default LostInTranslation;