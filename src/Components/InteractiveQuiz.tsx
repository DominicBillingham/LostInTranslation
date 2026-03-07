import {useEffect, useRef, useState} from "react";
import type {StorageAPI} from "@/Managers/LocalStorage.ts";
import type {Quiz, QuizOption} from "@/Interfaces.ts";

interface InteractiveQuizProps {
    quiz: Quiz;
    active: boolean;
    navigateToNode: any;
    LocalStorage: StorageAPI;
}

export default function InteractiveQuiz({quiz, active, navigateToNode, LocalStorage}: InteractiveQuizProps) {
    const [areOptionsEnabled, setAreOptionsEnabled] = useState<boolean>(true);
    const [quizText, setQuizText] = useState<string>("");
    const [feedbackText, setFeedbackText] = useState<string>("");
    const [selectedIsCorrect, setSelectedIsCorrect] = useState<boolean | null>(null);
    const [hasContinued, setHasContinued] = useState<boolean>(false);

    const answerStartRef = useRef<number | null>(null);
    const endRef = useRef<HTMLDivElement | null>(null);

    function scrollToBottom() {
        requestAnimationFrame(() => {
            endRef.current?.scrollIntoView({behavior: "smooth", block: "end"});
        });
    }

    useEffect(() => {
        if (quiz?.quizQuestion) {
            setQuizText(quiz.quizQuestion);
            setAreOptionsEnabled(true);
            setFeedbackText("");
            setSelectedIsCorrect(null);
            setHasContinued(false);
            answerStartRef.current = (typeof performance !== "undefined" ? performance.now() : Date.now());
            scrollToBottom();
        }
    }, [quiz]);

    useEffect(() => {
        scrollToBottom();
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
            <div className="chat-bubble fade2">{quizText}</div>

            {areOptionsEnabled ? (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-[1vh] mt-[0.5vh]">
                    {Array.isArray(quiz?.quizAnswers) && (
                        quiz.quizAnswers.slice(0, 4).map((ans: QuizOption, i: number) => (
                            <button
                                key={ans.answerText + i}
                                type="button"
                                disabled={!areOptionsEnabled || !active}
                                className="choice-btn rounded-[1vh] p-[1.2vh] shadow-md hover:shadow-lg text-left hover:cursor-pointer fade2"
                                onClick={() => chooseAnswer(ans)}
                            >
                                {ans.answerText}
                            </button>
                        ))
                    )}
                </div>
            ) : (
                <>
                    {feedbackText && (
                        <div className="chat-bubble fade2">
                            <span className={selectedIsCorrect ? "text-green-700 font-semibold" : "text-red-700 font-semibold"}>
                                {selectedIsCorrect ? "Correct: " : "Incorrect: "}
                            </span>
                            <span>{feedbackText}</span>
                        </div>
                    )}

                    {!hasContinued && (
                        <div className="mt-[0.5vh] flex justify-start">
                            <button
                                type="button"
                                disabled={!active}
                                className="choice-btn rounded-[1vh] px-[3vh] py-[1vh] shadow-md hover:shadow-lg hover:cursor-pointer fade2 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={continueQuiz}
                            >
                                Continue
                            </button>
                        </div>
                    )}
                </>
            )}

            <div ref={endRef}></div>
        </div>
    );
}
