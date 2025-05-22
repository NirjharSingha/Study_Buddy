"use client";

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { API_CONFIG } from '@/config/api';

export const AssessmentNav: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">{t('assessmentTitle')}</h2>
            <p className="text-gray-600 mb-6">{t('assessmentDescription')}</p>

            <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">{t('availableTopics')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {API_CONFIG.TOPICS.map((topic) => (
                        <Link
                            key={topic}
                            href={`/assessment?topic=${encodeURIComponent(topic)}`}
                            className="block p-4 border rounded-lg hover:bg-blue-50 transition-colors bg-white"
                        >
                            <h4 className="font-medium capitalize text-gray-900">{topic}</h4>
                            <p className="text-sm text-gray-600">
                                {t(`topics.${topic}`)}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="mt-6">
                <Link
                    href="/assessment"
                    className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    {t('startNewAssessment')}
                </Link>
            </div>
        </div>
    );
}; 