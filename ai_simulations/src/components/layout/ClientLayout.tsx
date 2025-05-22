"use client";

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface ClientLayoutProps {
    children: React.ReactNode;
}

export const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
    const { language, setLanguage, t } = useLanguage();

    return (
        <>
            <nav className="bg-gray-800 text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="space-x-4">
                        <Link href="/" className="hover:text-gray-300">
                            {t('home')}
                        </Link>
                        <Link href="/simulations/double-pendulum" className="hover:text-gray-300">
                            {t('simulation')}
                        </Link>
                        <Link href="/simulations/chemistry-lab" className="hover:text-gray-300">
                            {t('chemistryLab')}
                        </Link>
                    </div>
                    <div className="space-x-2">
                        <button
                            onClick={() => setLanguage('en')}
                            className={`px-3 py-1 rounded ${language === 'en' ? 'bg-blue-600' : 'bg-gray-600'}`}
                        >
                            English
                        </button>
                        <button
                            onClick={() => setLanguage('bn')}
                            className={`px-3 py-1 rounded ${language === 'bn' ? 'bg-blue-600' : 'bg-gray-600'}`}
                        >
                            বাংলা
                        </button>
                    </div>
                </div>
            </nav>
            <main>{children}</main>
        </>
    );
}; 