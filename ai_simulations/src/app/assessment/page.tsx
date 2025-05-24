"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AssessmentForm } from '@/components/assessment/AssessmentForm';
import { AssessmentResults } from '@/components/assessment/AssessmentResults';
import { AssessmentService } from '@/lib/services/assessmentService';
import { Assessment, AssessmentResult } from '@/types/assessment';
import { useLanguage } from '@/lib/contexts/LanguageContext';

export default function AssessmentPage() {
    const searchParams = useSearchParams();
    const topic = searchParams.get('topic');
    const { t } = useLanguage();
    const [assessment, setAssessment] = useState<Assessment | null>(null);
    const [result, setResult] = useState<AssessmentResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (topic) {
            generateAssessment(topic);
        }
    }, [topic]);

    const generateAssessment = async (selectedTopic: string) => {
        try {
            setLoading(true);
            setError(null);
            const newAssessment = await AssessmentService.generateAssessment(selectedTopic);
            setAssessment(newAssessment);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate assessment');
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = (assessmentResult: AssessmentResult) => {
        setResult(assessmentResult);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">{t('generatingAssessment')}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => topic && generateAssessment(topic)}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                        {t('tryAgain')}
                    </button>
                </div>
            </div>
        );
    }

    if (result) {
        return <AssessmentResults result={result} onClose={() => setResult(null)} />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {assessment ? (
                        <AssessmentForm assessment={assessment} onComplete={handleComplete} />
                    ) : (
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                {t('AI Assesment')}
                            </h1>
                            <p className="text-gray-600 mb-8">{t('assessmentDescription')}</p>
                            <button
                                onClick={() => topic && generateAssessment(topic)}
                                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                            >
                                {t('startNewAssessment')}
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
} 