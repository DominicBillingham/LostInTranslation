export interface Scene {
    nodeName: string;
    storyDecision: string;
    image?: string;
    sentences: string[];
    options?: string[];
    quizName?: string;
    hints?: Record<string, string>;
}
export interface Quiz {
    quizName: string;
    nextOption?: string;
    nextScene?: string;
    quizQuestion: string;
    quizAnswers: QuizOption[];
}
export interface QuizOption {
    answerText: string;
    isCorrectAnswer: boolean;
    reason: string;
}