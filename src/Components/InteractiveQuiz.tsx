import {useEffect, useRef, useState} from "react";
import LocalStorage, {type StorageAPI} from "@/Managers/LocalStorage.ts";
import type {Quiz, QuizOption} from "@/Interfaces.ts";

interface InteractiveQuizProps {
    quiz: Quiz;
    active: boolean;
    navigateToNode: any;
    onContentUpdate: () => void;
}

export default function InteractiveQuiz({quiz, active, navigateToNode, onContentUpdate}: InteractiveQuizProps) {
    const [areOptionsEnabled, setAreOptionsEnabled] = useState<boolean>(true);
    const [quizText, setQuizText] = useState<string>("");
    const [feedbackText, setFeedbackText] = useState<string>("");
    const [selectedIsCorrect, setSelectedIsCorrect] = useState<boolean | null>(null);
    const [hasContinued, setHasContinued] = useState<boolean>(false);

    const answerStartRef = useRef<number | null>(null);

    useEffect(() => {
        if (quiz?.quizQuestion) {
            setQuizText(quiz.quizQuestion);
            setAreOptionsEnabled(true);
            setFeedbackText("");
            setSelectedIsCorrect(null);
            setHasContinued(false);
            answerStartRef.current = (typeof performance !== "undefined" ? performance.now() : Date.now());
            onContentUpdate();
        }
    }, [quiz]);

    useEffect(() => {
        onContentUpdate();
    }, [areOptionsEnabled, feedbackText, quizText]);

    function chooseAnswer(quizAnswer: QuizOption) {
        if (!active) return;
        setAreOptionsEnabled(false);

        setFeedbackText(quizAnswer.reason || quizAnswer.answerText || "");
        setSelectedIsCorrect(!!quizAnswer.isCorrectAnswer);

        const now = (typeof performance !== "undefined" ? performance.now() : Date.now());
        const started = answerStartRef.current;
        const elapsed = started != null ? Math.max(0, Math.round(now - started)) : null;

        void LocalStorage.logQuizChoice({
            question: quiz.quizQuestion,
            answer: quizAnswer.answerText,
            wasCorrect: quizAnswer.isCorrectAnswer,
            timeMs: elapsed ?? undefined,
        });
        answerStartRef.current = null;
    }

    function continueQuiz() {
        if (!active || hasContinued) return;
        setHasContinued(true);
        if (quiz.nextNode) {
            navigateToNode(quiz.nextNode);
        }
    }

    return (
        <div className="journal-stream">
            <h2 className="text-[3.2vh] font-bold text-center ink-title">
                Mini Quiz!
            </h2>
            <div className="border-b border-2 border-amber-800/20 w-1/2 mx-auto my-[0.2vh]"></div>

            <div className="chat-bubble short-fade">{quizText}</div>
            
            <div className="w-full flex flex-col items-center gap-[1vh] mt-[0.5vh]">
                {Array.isArray(quiz?.quizAnswers) && (
                    quiz.quizAnswers.slice(0, 4).map((ans: QuizOption, i: number) => (
                        <button
                            key={ans.answerText + i}
                            type="button"
                            disabled={!areOptionsEnabled || !active}
                            className="choice-btn w-full sm:w-2/3 rounded-[1vh] p-[1.2vh] shadow-md hover:shadow-lg text-center hover:cursor-pointer short-fade disabled:opacity-30 disabled:cursor-not-allowed"
                            onClick={() => chooseAnswer(ans)}
                        >
                            {ans.answerText}
                        </button>
                    ))
                )}
            </div>

            {!areOptionsEnabled && (
                <>
                    {feedbackText && (
                        <div className="chat-bubble short-fade">
                            <span className={selectedIsCorrect ? "text-green-700 font-semibold" : "text-red-700 font-semibold"}>
                                {selectedIsCorrect ? "Correct: " : "Incorrect: "}
                            </span>
                            <span>{feedbackText}</span>
                        </div>
                    )}

                    {!hasContinued && (
                        <div className="mt-[0.5vh] flex justify-end">
                            <button
                                type="button"
                                disabled={!active}
                                className="choice-btn rounded-[1vh] px-[3vh] py-[1vh] shadow-md hover:shadow-lg hover:cursor-pointer short-fade disabled:opacity-30 disabled:cursor-not-allowed"
                                onClick={continueQuiz}
                            >
                                Continue
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
