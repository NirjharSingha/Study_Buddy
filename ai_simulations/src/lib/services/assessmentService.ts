import { Assessment, Question, StudentAnswer, AssessmentResult } from '@/types/assessment';

export class AssessmentService {
    private static async callGemini(prompt: string) {
        try {
            const response = await fetch(`${window.location.origin}/api/gemini`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate assessment');
            }

            const data = await response.json();
            return data.result;
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            throw new Error('Failed to generate assessment. Please try again later.');
        }
    }

    static async generateAssessment(topic: string): Promise<Assessment> {
        const prompt = `Create a multiple choice quiz about ${topic}. The response should be a JSON array with 5 questions. Each question must have:
        - id: a unique string
        - type: "mcq"
        - question: the question text
        - options: array of 4 options with id (a,b,c,d) and text
        - correctAnswer: the id of the correct option
        - explanation: why this is the correct answer
        - points: 2

        Example format:
        [{
            "id": "q1",
            "type": "mcq",
            "question": "What is the capital of France?",
            "options": [
                {"id": "a", "text": "London"},
                {"id": "b", "text": "Paris"},
                {"id": "c", "text": "Berlin"},
                {"id": "d", "text": "Madrid"}
            ],
            "correctAnswer": "b",
            "explanation": "Paris is the capital city of France.",
            "points": 2
        }]

        Make sure to return only valid JSON.`;

        const response = await this.callGemini(prompt);
        let questions;
        try {
            // Try to extract JSON from the response
            const jsonMatch = response.match(/\[[\s\S]*\]/);
            if (!jsonMatch) {
                throw new Error('No valid JSON found in response');
            }
            questions = JSON.parse(jsonMatch[0]);

            if (!Array.isArray(questions) || questions.length === 0) {
                throw new Error('Invalid question format');
            }

            // Validate each question has required fields
            questions.forEach((q, index) => {
                if (!q.id || !q.type || !q.question || !q.options || !q.correctAnswer || !q.explanation || !q.points) {
                    throw new Error(`Question ${index + 1} is missing required fields`);
                }
            });
        } catch (error) {
            console.error('Failed to parse questions:', error);
            throw new Error('Failed to generate valid questions. Please try again.');
        }

        return {
            id: Math.random().toString(36).substring(7),
            topic,
            title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Assessment`,
            description: `Test your knowledge of ${topic} with this interactive assessment.`,
            questions,
            totalPoints: questions.reduce((sum: number, q: Question) => sum + q.points, 0),
            timeLimit: 30
        };
    }

    static async gradeAssessment(assessment: Assessment, answers: StudentAnswer[]): Promise<AssessmentResult> {
        let totalScore = 0;
        const feedback: string[] = [];

        for (const answer of answers) {
            const question = assessment.questions.find(q => q.id === answer.questionId);
            if (!question) continue;

            const isCorrect = answer.answer === question.correctAnswer;
            totalScore += isCorrect ? question.points : 0;
            feedback.push(`${question.question}: ${isCorrect ? 'Correct' : 'Incorrect'}. ${question.explanation}`);
        }

        return {
            assessmentId: assessment.id,
            studentId: 'current-user',
            answers,
            score: totalScore,
            feedback: feedback.join('\n'),
            submittedAt: new Date()
        };
    }
} 