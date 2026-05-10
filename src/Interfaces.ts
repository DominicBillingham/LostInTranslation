export interface Scene {
    nodeName: string;
    storyDecision: string;
    nextNodeOptions?: NextNodeOption[];
    image?: string;
    sentences: string[];
    quizName?: string;
}

export interface NextNodeOption {
    nodeName: string;
    displayText: string;
}
export interface Quiz {
    nodeName: string;
    nextNode?: string;
    quizQuestion: string;
    quizAnswers: QuizOption[];
}
export interface QuizOption {
    answerText: string;
    isCorrectAnswer: boolean;
    reason: string;
}