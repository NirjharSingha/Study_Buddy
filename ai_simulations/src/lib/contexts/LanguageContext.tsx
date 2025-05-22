"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'bn';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const translations = {
    en: {
        // Navigation
        'home': 'Home',

        // Existing translations
        'length1': 'Length 1',
        'length2': 'Length 2',
        'mass1': 'Mass 1',
        'mass2': 'Mass 2',
        'gravity': 'Gravity',
        'damping': 'Damping',
        'pixels': 'px',
        'kilograms': 'kg',
        'metersPerSecondSquared': 'm/s²',
        'dragToInteract': 'Drag to interact',
        'simulation': 'Double Pendulum Simulation',
        'description': 'A chaotic system demonstrating complex motion',

        // Chemistry Lab translations
        'chemistryLab': 'Chemistry Lab',
        'chemistryLabDescription': 'Interactive chemistry lab to explore acids, bases, and pH indicators',
        'chemicals': 'Chemicals',
        'acid': 'Acid',
        'base': 'Base',
        'salt': 'Salt',
        'neutral': 'Neutral',
        'instructions': 'Instructions',
        'instruction1': 'Select a chemical from the panel',
        'instruction2': 'Click on a beaker to fill it',
        'instruction3': 'Drag litmus paper to test the solution',
        'litmusPaper': 'Litmus Paper',
        'beaker': 'Beaker',
        'pH': 'pH',
        'result': 'Result',
        'acidic': 'Acidic',
        'basic': 'Basic',
        'neutral': 'Neutral',
        'dinosaurAR': 'Dinosaur AR Experience',
        'dinosaurARDescription': 'Experience dinosaurs in augmented reality. View and interact with 3D dinosaur models in your environment.',
        'aboutDinosaurs': 'About Dinosaurs',
        'dinosaurInfo1': 'Dinosaurs were a diverse group of reptiles that first appeared during the Triassic period, about 230 million years ago. They dominated the Earth for over 160 million years before their extinction.',
        'dinosaurInfo2': 'The largest dinosaurs were the sauropods, which could reach lengths of over 30 meters and weights of up to 100 tons. The smallest dinosaurs were about the size of a chicken.',
        'dinosaurInfo3': 'Scientists believe that dinosaurs went extinct about 65 million years ago, likely due to a massive asteroid impact that caused dramatic climate changes.',
        'arNotSupported': 'AR is not supported on your device. Please try on a mobile device with AR capabilities.',
        'arInstruction1': 'Click the "Start AR" button to begin the experience',
        'arInstruction2': 'Allow camera access when prompted',
        'arInstruction3': 'Point your camera at a flat surface to place the dinosaur',
    },
    bn: {
        // Navigation
        'home': 'হোম',

        // Existing translations
        'length1': 'দৈর্ঘ্য ১',
        'length2': 'দৈর্ঘ্য ২',
        'mass1': 'ভর ১',
        'mass2': 'ভর ২',
        'gravity': 'মহাকর্ষ',
        'damping': 'অবমূল্যায়ন',
        'pixels': 'পিক্সেল',
        'kilograms': 'কেজি',
        'metersPerSecondSquared': 'মি/সে²',
        'dragToInteract': 'ইন্টারঅ্যাক্ট করতে টেনুন',
        'simulation': 'ডাবল পেন্ডুলাম সিমুলেশন',
        'description': 'জটিল গতি প্রদর্শনকারী একটি বিশৃঙ্খল ব্যবস্থা',

        // Chemistry Lab translations
        'chemistryLab': 'রসায়ন ল্যাব',
        'chemistryLabDescription': 'অ্যাসিড, ক্ষার এবং pH নির্দেশক অন্বেষণ করার জন্য ইন্টারেক্টিভ রসায়ন ল্যাব',
        'chemicals': 'রাসায়নিক পদার্থ',
        'acid': 'অ্যাসিড',
        'base': 'ক্ষার',
        'salt': 'লবণ',
        'neutral': 'নিরপেক্ষ',
        'instructions': 'নির্দেশাবলী',
        'instruction1': 'প্যানেল থেকে একটি রাসায়নিক পদার্থ নির্বাচন করুন',
        'instruction2': 'ভরাট করতে একটি বিকার ক্লিক করুন',
        'instruction3': 'সমাধান পরীক্ষা করতে লিটমাস পেপার টেনুন',
        'litmusPaper': 'লিটমাস পেপার',
        'beaker': 'বিকার',
        'pH': 'pH',
        'result': 'ফলাফল',
        'acidic': 'অম্লীয়',
        'basic': 'ক্ষারীয়',
        'neutral': 'নিরপেক্ষ',
        'dinosaurAR': 'ডাইনোসর এআর অভিজ্ঞতা',
        dinosaurAR: 'ডাইনোসর এআর অভিজ্ঞতা',
        arNotSupported: 'আপনার ডিভাইসে এআর সমর্থিত নয়। অনুগ্রহ করে এআর ক্ষমতা সহ একটি মোবাইল ডিভাইসে চেষ্টা করুন।',
        arInstruction1: 'অভিজ্ঞতা শুরু করতে "এআর শুরু করুন" বাটনে ক্লিক করুন',
        arInstruction2: 'অনুরোধ করা হলে ক্যামেরা অ্যাক্সেস অনুমতি দিন',
        arInstruction3: 'ডাইনোসর রাখার জন্য আপনার ক্যামেরা একটি সমতল পৃষ্ঠের দিকে নির্দেশ করুন',
    },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('en');

    const t = (key: string): string => {
        return translations[language][key as keyof typeof translations[typeof language]] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}; 