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

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            {t('assessmentResults')}
                        </h2>
                        <p className="text-gray-600">
                            {t('submittedAt')}: {result.submittedAt.toLocaleString()}
                        </p>
                    </div>

                    <div className="mb-8">
                        <div className="text-center">
                            <p className="text-2xl font-semibold text-gray-900 mb-2">
                                {t('yourScore')}: {result.score}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            {t('feedback')}
                        </h3>
                        <div className="space-y-4">
                            {result.feedback.split('\n').map((feedback, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-700">{feedback}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <button
                            onClick={onClose}
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                        >
                            {t('close')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}; 