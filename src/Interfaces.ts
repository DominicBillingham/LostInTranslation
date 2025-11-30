export interface Scene {
    nodeName: string;
    storyDecision: string;
    nextNodeOptions?: string[];
    image?: string;
    sentences: string[];
    quizName?: string;
    hints?: Record<string, string>;
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