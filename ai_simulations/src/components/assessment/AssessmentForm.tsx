"use client";

import React, { useState } from 'react';
import { Assessment, StudentAnswer } from '@/types/assessment';
import { AssessmentService } from '@/lib/services/assessmentService';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface AssessmentFormProps {
    assessment: Assessment;
    onComplete: (result: any) => void;
}

export const AssessmentForm: React.FC<AssessmentFormProps> = ({ assessment, onComplete }) => {
    const { t } = useLanguage();
    const [answers, setAnswers] = useState<StudentAnswer[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const handleAnswerChange = (questionId: string, answer: string) => {
        setAnswers(prev => {
            const existing = prev.findIndex(a => a.questionId === questionId);
            if (existing >= 0) {
                const updated = [...prev];
                updated[existing] = { ...updated[existing], answer };
                return updated;
            }
            return [...prev, { questionId, answer }];
        });
    };

    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            const result = await AssessmentService.gradeAssessment(assessment, answers);
            onComplete(result);
        } catch (error) {
            console.error('Error submitting assessment:', error);
            alert('Failed to submit assessment. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const isAllAnswered = answers.length === assessment.questions.length;

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{assessment.title}</h1>
                <p className="text-gray-600">{assessment.description}</p>
            </div>

            <div className="space-y-6">
                {assessment.questions.map((question, index) => (
                    <div key={question.id} className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            {index + 1}. {question.question}
                        </h3>
                        <div className="space-y-3">
                            {question.options?.map(option => (
                                <label
                                    key={option.id}
                                    className="flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50"
                                >
                                    <input
                                        type="radio"
                                        name={`question-${question.id}`}
                                        value={option.id}
                                        checked={answers.find(a => a.questionId === question.id)?.answer === option.id}
                                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                        className="h-4 w-4 text-blue-600"
                                    />
                                    <span className="text-gray-700">{option.text}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center">
                <button
                    onClick={handleSubmit}
                    disabled={!isAllAnswered || submitting}
                    className={`px-6 py-2 rounded-lg text-white font-medium ${isAllAnswered && !submitting
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-gray-400 cursor-not-allowed'
                        }`}
                >
                    {submitting ? t('submitting') : t('submit')}
                </button>
            </div>
        </div>
    );
}; 