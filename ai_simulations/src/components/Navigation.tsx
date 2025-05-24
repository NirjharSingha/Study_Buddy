"use client";

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/contexts/LanguageContext';

export const Navigation: React.FC = () => {
    const { t } = useLanguage();

    return (
        <nav className="bg-blue-900/80 backdrop-blur-sm shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link href="/" className="flex items-center">
                            <span className="text-xl font-bold text-white">
                                Learning Platform
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}; 