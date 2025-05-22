'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'es' | 'fr' | 'de';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const translations = {
    en: {
        'simulations.title': 'Interactive Simulations',
        'simulations.back': 'Back to Simulations',
        'doublePendulum.title': 'Double Pendulum',
        'doublePendulum.description': 'Explore the chaotic motion of a double pendulum system.',
        'chemistryLab.title': 'Chemistry Lab',
        'chemistryLab.description': 'Experiment with chemical reactions in a virtual laboratory.',
        'dinosaurAR.title': 'Dinosaur AR Experience',
        'dinosaurAR.description': 'View a 3D dinosaur model in augmented reality.',
        'simulations.pause': 'Pause',
        'simulations.resume': 'Resume',
        'simulations.reset': 'Reset',
        'simulations.length1': 'Length 1',
        'simulations.length2': 'Length 2',
        'simulations.mass1': 'Mass 1',
        'simulations.mass2': 'Mass 2',
        'simulations.gravity': 'Gravity',
        'simulations.damping': 'Damping'
    },
    es: {
        'simulations.title': 'Simulaciones Interactivas',
        'simulations.back': 'Volver a Simulaciones',
        'doublePendulum.title': 'Péndulo Doble',
        'doublePendulum.description': 'Explora el movimiento caótico de un sistema de péndulo doble.',
        'chemistryLab.title': 'Laboratorio de Química',
        'chemistryLab.description': 'Experimenta con reacciones químicas en un laboratorio virtual.',
        'dinosaurAR.title': 'Experiencia AR de Dinosaurio',
        'dinosaurAR.description': 'Visualiza un modelo 3D de dinosaurio en realidad aumentada.',
        'simulations.pause': 'Pausar',
        'simulations.resume': 'Reanudar',
        'simulations.reset': 'Reiniciar',
        'simulations.length1': 'Longitud 1',
        'simulations.length2': 'Longitud 2',
        'simulations.mass1': 'Masa 1',
        'simulations.mass2': 'Masa 2',
        'simulations.gravity': 'Gravedad',
        'simulations.damping': 'Amortiguación'
    },
    fr: {
        'simulations.title': 'Simulations Interactives',
        'simulations.back': 'Retour aux Simulations',
        'doublePendulum.title': 'Double Pendule',
        'doublePendulum.description': 'Explorez le mouvement chaotique d\'un système de double pendule.',
        'chemistryLab.title': 'Laboratoire de Chimie',
        'chemistryLab.description': 'Expérimentez avec des réactions chimiques dans un laboratoire virtuel.',
        'dinosaurAR.title': 'Expérience AR de Dinosaure',
        'dinosaurAR.description': 'Visualisez un modèle 3D de dinosaure en réalité augmentée.',
        'simulations.pause': 'Pause',
        'simulations.resume': 'Reprendre',
        'simulations.reset': 'Réinitialiser',
        'simulations.length1': 'Longueur 1',
        'simulations.length2': 'Longueur 2',
        'simulations.mass1': 'Masse 1',
        'simulations.mass2': 'Masse 2',
        'simulations.gravity': 'Gravité',
        'simulations.damping': 'Amortissement'
    },
    de: {
        'simulations.title': 'Interaktive Simulationen',
        'simulations.back': 'Zurück zu Simulationen',
        'doublePendulum.title': 'Doppeltes Pendel',
        'doublePendulum.description': 'Erkunden Sie die chaotische Bewegung eines Doppelpendelsystems.',
        'chemistryLab.title': 'Chemielabor',
        'chemistryLab.description': 'Experimentieren Sie mit chemischen Reaktionen in einem virtuellen Labor.',
        'dinosaurAR.title': 'Dinosaurier AR-Erlebnis',
        'dinosaurAR.description': 'Betrachten Sie ein 3D-Dinosaurier-Modell in Augmented Reality.',
        'simulations.pause': 'Pause',
        'simulations.resume': 'Fortsetzen',
        'simulations.reset': 'Zurücksetzen',
        'simulations.length1': 'Länge 1',
        'simulations.length2': 'Länge 2',
        'simulations.mass1': 'Masse 1',
        'simulations.mass2': 'Masse 2',
        'simulations.gravity': 'Schwerkraft',
        'simulations.damping': 'Dämpfung'
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('en');

    const t = (key: string): string => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
} 