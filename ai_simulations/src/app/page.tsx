"use client";

import React from 'react';
import Link from 'next/link';
import { AssessmentNav } from '@/components/navigation/AssessmentNav';
import { Navigation } from '@/components/Navigation';
import { useLanguage } from '@/lib/contexts/LanguageContext';

export default function Home() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">{t('home')}</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-900">{t('simulation')}</h2>
                            <p className="text-gray-600 mb-4">{t('description')}</p>
                            <Link
                                href="/simulations/double-pendulum"
                                className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                            >
                                {t('simulation')}
                            </Link>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-900">{t('chemistryLab')}</h2>
                            <p className="text-gray-600 mb-4">{t('chemistryLabDescription')}</p>
                            <Link
                                href="/simulations/chemistry-lab"
                                className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                            >
                                {t('chemistryLab')}
                            </Link>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Physics Lab</h2>
                            <p className="text-gray-600 mb-4">Explore interactive physics simulations including pendulum motion, projectile motion, and a solar system model.</p>
                            <Link
                                href="/physics-lab"
                                className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                            >
                                Launch Physics Lab
                            </Link>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-900">{t('dinosaurAR')}</h2>
                            <p className="text-gray-600 mb-4">{t('dinosaurARDescription')}</p>
                            <Link
                                href="/simulations/dinosaur-ar"
                                className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                            >
                                {t('dinosaurAR')}
                            </Link>
                        </div>
                    </div>

                    <div className="mt-12">
                        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">{t('assessmentTitle')}</h2>
                        <AssessmentNav />
                    </div>
                </div>
            </main>
        </div>
    );
}
