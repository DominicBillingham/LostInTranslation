import {useEffect, useRef, useState} from "react";
import storage, { type StorageAPI } from "./storage.ts";
import InteractiveStory from "./InteractiveStory.tsx";
import InteractiveQuiz from "./InteractiveQuiz.tsx";

// send data to the spreadsheet whenever a choice is made
// log the data
// fix it for smaller screen sizes


interface Scene {
    sceneName: string;
    image?: string;
    sentences: string[];
    options?: string[];
    quizName?: string;
    hints?: Record<string, string>;
}
interface Quiz {
    quizName: string;
    nextOption?: string;
    nextScene?: string;
    quizQuestion: string;
    quizAnswers: QuizOption[];
}
interface QuizOption {
    answerText: string;
    isCorrectAnswer: boolean;
    reason: string;
}

// quick commit test

function LostInTranslation({ storage }: { storage?: StorageAPI }) {

    const startingImage = "start.jpg";
    
    // Main Containers
    const sceneRef = useRef<Scene | null>(null);
    const quizRef = useRef<Quiz | null>(null);
    const lastImageRef = useRef<string>(startingImage);
    
    async function FetchSceneFromJson(sceneName: string) {
        const response = await fetch("adventure.json");
        const json: Scene[] = await response.json();
        sceneRef.current = json.find(s => s.sceneName === sceneName) ?? null;
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


        storage.incrementPlaythroughAttempts();

        await FetchSceneFromJson("Introduction");
        
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
    
    async function NavgiateToNode(nodeName: string) {
        
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
                        
                        {imageHmtl}
                        
                        {displayScene &&
                            <InteractiveStory key={sceneKey} sceneRef={sceneRef} navigateToNode={NavgiateToNode} storage={storage} />
                        }
                        
                        {displayQuiz &&
                            <InteractiveQuiz key={quizKey} quizRef={quizRef} navigateToNode={NavgiateToNode}/>
                        }
                        
                    </div>
                </div>
            </div>
        </>
    )
}

export default LostInTranslation;