"use client";

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { API_CONFIG } from '@/config/api';
import { motion } from 'framer-motion';

export const AssessmentNav: React.FC = () => {
    const { t } = useLanguage();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const getTopicDescription = (topic: string) => {
        const descriptions: { [key: string]: string } = {
            'chemistry': 'Explore chemical reactions, elements, and molecular structures',
            'physics': 'Study mechanics, thermodynamics, and modern physics concepts',
            'biology': 'Learn about living organisms, cells, and biological processes',
            'mathematics': 'Master algebra, calculus, and mathematical problem-solving',
            'computer science': 'Understand programming, algorithms, and computer systems'
        };
        return descriptions[topic] || '';
    };

    return (
        <div className="bg-blue-800/50 backdrop-blur-sm shadow-xl rounded-xl p-8 border border-blue-600">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-6 text-white">AI Assessment</h2>
                <p className="text-gray-200 mb-8 text-lg leading-relaxed">
                    Test your knowledge with our interactive assessments. Choose a topic to begin your learning journey.
                </p>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                >
                    <h3 className="text-xl font-semibold text-white mb-4">Available Topics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {API_CONFIG.TOPICS.map((topic) => (
                            <motion.div
                                key={topic}
                                variants={itemVariants}
                            >
                                <Link
                                    href={`/assessment?topic=${encodeURIComponent(topic)}`}
                                    className="block p-6 rounded-lg hover:shadow-lg transition-all bg-blue-700/50 border border-blue-500 hover:border-blue-400"
                                >
                                    <h4 className="font-semibold text-lg mb-2 text-white capitalize">
                                        {topic.split('-').map(word =>
                                            word.charAt(0).toUpperCase() + word.slice(1)
                                        ).join(' ')}
                                    </h4>
                                    <p className="text-gray-200 text-sm leading-relaxed">
                                        {getTopicDescription(topic)}
                                    </p>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <div className="mt-8 text-center">
                    <Link
                        href="/assessment"
                        className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg text-lg font-semibold"
                    >
                        Start New Assessment
                    </Link>
                </div>
            </div>
        </div>
    );
}; 