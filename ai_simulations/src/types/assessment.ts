export type QuestionType = 'mcq' | 'written';

export interface MCQOption {
    id: string;
    text: string;
}

export interface Question {
    id: string;
    type: QuestionType;
    question: string;
    options?: MCQOption[];
    correctAnswer: string;
    explanation: string;
    points: number;
}

export interface Assessment {
    id: string;
    topic: string;
    title: string;
    description: string;
    questions: Question[];
    totalPoints: number;
    timeLimit?: number; // in minutes
}

export interface StudentAnswer {
    questionId: string;
    answer: string;
    imageUrl?: string; // For written questions with image uploads
}

export interface AssessmentResult {
    assessmentId: string;
    studentId: string;
    answers: StudentAnswer[];
    score: number;
    feedback: string;
    submittedAt: Date;
} 