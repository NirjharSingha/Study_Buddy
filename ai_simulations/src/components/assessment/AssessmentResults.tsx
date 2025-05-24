"use client";

import React from 'react';
import { AssessmentResult } from '@/types/assessment';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface AssessmentResultsProps {
    result: AssessmentResult;
    onClose: () => void;
}

export const AssessmentResults: React.FC<AssessmentResultsProps> = ({ result, onClose }) => {
    const { t } = useLanguage();

    const getFeedbackStyle = (feedback: string) => {
        // Check if the feedback indicates an incorrect answer
        const isIncorrect = feedback.toLowerCase().includes('incorrect') ||
            feedback.toLowerCase().includes('wrong') ||
            feedback.toLowerCase().includes('not correct') ||
            feedback.toLowerCase().includes('try again');

        return isIncorrect
            ? 'bg-red-50 border border-red-200'
            : 'bg-green-50 border border-green-200';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-blue-100">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            Assessment Results
                        </h2>
                        <p className="text-gray-600">
                            Submitted: {result.submittedAt.toLocaleString()}
                        </p>
                    </div>

                    <div className="mb-8">
                        <div className="text-center">
                            <p className="text-2xl font-semibold text-gray-900 mb-2">
                                Your Score: {result.score}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            Detailed Feedback
                        </h3>
                        <div className="space-y-4">
                            {result.feedback.split('\n').map((feedback, index) => (
                                <div
                                    key={index}
                                    className={`p-4 rounded-lg ${getFeedbackStyle(feedback)}`}
                                >
                                    <p className="text-gray-700 leading-relaxed">{feedback}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <button
                            onClick={onClose}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg text-lg font-semibold"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}; 