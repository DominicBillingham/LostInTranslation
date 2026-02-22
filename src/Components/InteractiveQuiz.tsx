import {useEffect, useRef, useState, type RefObject} from "react";
import type {StorageAPI} from "@/Managers/LocalStorage.ts";
import type {Quiz, QuizOption} from "@/Interfaces.ts";

interface InteractiveQuizProps {
    quizRef: RefObject<Quiz>;
    navigateToNode: any;
    LocalStorage: StorageAPI;
}

export default function InteractiveQuiz({quizRef, navigateToNode, LocalStorage}: InteractiveQuizProps) {
    
    const [refreshAnimations, setRefreshAnimations] = useState(0);
    const [areOptionsEnabled, setAreOptionsEnabled] = useState<boolean>(true);
    const [quizText, setQuizText] = useState<string>('');
    const [feedbackText, setFeedbackText] = useState<string>('');
    const [selectedIsCorrect, setSelectedIsCorrect] = useState<boolean | null>(null);
    const answerStartRef = useRef<number | null>(null);

    useEffect(() => {
        const current = quizRef?.current as (Quiz & { reasontext?: string }) | undefined;
        if (current?.quizQuestion) {
            setQuizText(current.quizQuestion);
            setAreOptionsEnabled(true);
            setFeedbackText('');
            setSelectedIsCorrect(null);
            setRefreshAnimations((v) => v + 1);
            answerStartRef.current = (typeof performance !== 'undefined' ? performance.now() : Date.now());
        }

    }, [quizRef]);

    function ChooseAnswer(quizAnswer: QuizOption) {
        
        setAreOptionsEnabled(false);
        const qr = quizRef?.current as (Quiz & { reasontext?: string }) | undefined;
        setFeedbackText(quizAnswer.reason || qr?.reasontext || quizAnswer.answerText || '');
        setSelectedIsCorrect(!!quizAnswer.isCorrectAnswer);
        setRefreshAnimations((v) => v + 1);
        
        const now = (typeof performance !== 'undefined' ? performance.now() : Date.now());
        const started = answerStartRef.current;
        const elapsed = started != null ? Math.max(0, Math.round(now - started)) : null;
        void LocalStorage.logQuizChoice({
            question: quizRef.current.quizQuestion,
            answer: quizAnswer.answerText,
            wasCorrect: quizAnswer.isCorrectAnswer,
            timeMs: elapsed ?? undefined,
        });
        answerStartRef.current = null;
    }

    function Continue() {
        const current = quizRef?.current as Quiz | undefined;
        if (!current) return;
        if (current.nextNode) {
            navigateToNode(current.nextNode);
            return;
        }
        if (current.nextNode) {
            navigateToNode(current.nextNode);
            return;
        }
    }

    return (
        <>
            <div className="inset-x-[3vh] bottom-[3vh] absolute">

                <div
                    id="storyTextBox"
                    className={`relative bg-white/90 rounded-[1vh] p-[1vh] ps-[2vh] text-gray-800 h-[10vh] shadow-md fade2 transition-all duration-500 ease-out transform`}
                >
                    <p className="fade" key={refreshAnimations}>
                        <span className={!areOptionsEnabled ? 'text-gray-500' : ''}>{quizText}</span>
                        {!areOptionsEnabled && feedbackText && (
                            <>
                                <br/>
                                {selectedIsCorrect !== null && (
                                    <>
                                        <span className={selectedIsCorrect ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                                            {selectedIsCorrect ? 'Correct - ' : 'Incorrect - '}
                                        </span>
                                        <span> </span>
                                    </>
                                )}
                                <span className="text-gray-800">{feedbackText}</span>
                            </>
                        )}
                    </p>
                </div>

                {/* Options */}
                <div className={`grid grid-cols-2 gap-[1vh] mt-[1vh] ${!areOptionsEnabled ? 'pointer-events-none opacity-60 cursor-not-allowed' : ''}`}>
                    {Array.isArray(quizRef?.current?.quizAnswers) && (
                        quizRef.current.quizAnswers.slice(0, 4).map((ans: QuizOption, i: number) => (
                            <button
                                key={ans.answerText + i}
                                type="button"
                                disabled={!areOptionsEnabled}
                                className="bg-orange-100/95 rounded-[1vh] p-[1vh] pl-3 text-gray-900 shadow-md hover:shadow-lg  border-[#FF7F50] border-3 text-left hover:cursor-pointer hover:bg-orange-200/95 fade "
                                onClick={() => ChooseAnswer(ans)}
                            >
                                {ans.answerText}
                            </button>
                        ))
                    )}
                </div>

                {/* Continue button always visible; disabled until an answer is chosen */}
                <div className="mt-[1vh] flex justify-center">
                    <button
                        type="button"
                        disabled={areOptionsEnabled}
                        className={`5 rounded-[1vh] px-[4vh] py-[1vh] text-gray-900 shadow-md border-[rgba(255,127,80,0.4)] border-3 text-center fade ${
                            areOptionsEnabled
                                ? 'pointer-events-none bg-orange-200/40  border-[#FF7F200] cursor-not-allowed'
                                : 'hover:shadow-lg bg-orange-200/90 hover:bg-orange-300/95 hover:cursor-pointer  '
                        }`}
                        onClick={Continue}
                    >
                        Continue
                    </button>
                </div>

            </div>
        </>
    )


}
