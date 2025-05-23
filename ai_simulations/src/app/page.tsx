"use client";

import React from 'react';
import Link from 'next/link';
import { AssessmentNav } from '@/components/navigation/AssessmentNav';
import { Navigation } from '@/components/Navigation';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { motion } from 'framer-motion';

export default function Home() {
    const { t } = useLanguage();

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white">
            <Navigation />
            <main className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-bold mb-12 text-center text-white"
                    >
                        {t('home')}
                    </motion.h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        <motion.div
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.1 }}
                            className="bg-blue-800/50 backdrop-blur-sm rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all border border-blue-600"
                        >
                            <h2 className="text-2xl font-bold mb-4 text-white">
                                {t('simulation')}
                            </h2>
                            <p className="text-gray-200 mb-6 leading-relaxed">{t('description')}</p>
                            <Link
                                href="/simulations/double-pendulum"
                                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                            >
                                {t('simulation')}
                            </Link>
                        </motion.div>

                        <motion.div
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.2 }}
                            className="bg-blue-800/50 backdrop-blur-sm rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all border border-blue-600"
                        >
                            <h2 className="text-2xl font-bold mb-4 text-white">
                                {t('chemistryLab')}
                            </h2>
                            <p className="text-gray-200 mb-6 leading-relaxed">{t('chemistryLabDescription')}</p>
                            <Link
                                href="/simulations/chemistry-lab"
                                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                            >
                                {t('chemistryLab')}
                            </Link>
                        </motion.div>

                        <motion.div
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.3 }}
                            className="bg-blue-800/50 backdrop-blur-sm rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all border border-blue-600"
                        >
                            <h2 className="text-2xl font-bold mb-4 text-white">
                                Physics Lab
                            </h2>
                            <p className="text-gray-200 mb-6 leading-relaxed">
                                Explore interactive physics simulations including pendulum motion, projectile motion, and a solar system model.
                            </p>
                            <Link
                                href="/physics-lab"
                                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                            >
                                Launch Physics Lab
                            </Link>
                        </motion.div>

                        <motion.div
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.4 }}
                            className="bg-blue-800/50 backdrop-blur-sm rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all border border-blue-600"
                        >
                            <h2 className="text-2xl font-bold mb-4 text-white">
                                {t('dinosaurAR')}
                            </h2>
                            <p className="text-gray-200 mb-6 leading-relaxed">{t('dinosaurARDescription')}</p>
                            <Link
                                href="/simulations/dinosaur-ar"
                                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                            >
                                {t('dinosaurAR')}
                            </Link>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-16"
                    >
                        <h2 className="text-4xl font-bold mb-10 text-center text-white">
                            AI Assessment
                        </h2>
                        <AssessmentNav />
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
