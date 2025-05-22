"use client";

import React from 'react';
import { DinosaurAR } from '@/components/simulations/DinosaurAR';
import { useLanguage } from '@/lib/contexts/LanguageContext';

export default function DinosaurARPage() {
    const { t } = useLanguage();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-center">{t('dinosaurAR')}</h1>

                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <div className="aspect-square w-full max-w-2xl mx-auto">
                        <DinosaurAR />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
                    <h2 className="text-2xl font-semibold mb-4">{t('aboutDinosaurs')}</h2>
                    <div className="prose max-w-none">
                        <p className="text-gray-700 mb-4">{t('dinosaurInfo1')}</p>
                        <p className="text-gray-700 mb-4">{t('dinosaurInfo2')}</p>
                        <p className="text-gray-700">{t('dinosaurInfo3')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
} 