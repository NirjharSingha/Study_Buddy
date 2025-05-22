"use client";

import React, { useEffect, useRef, useState } from 'react';
import { DoublePendulum } from '@/lib/simulations/DoublePendulum';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface DoublePendulumSimulationProps {
    width?: number;
    height?: number;
}

export const DoublePendulumSimulation: React.FC<DoublePendulumSimulationProps> = ({
    width = 800,
    height = 600
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const simulationRef = useRef<DoublePendulum | null>(null);
    const { t, language, setLanguage } = useLanguage();
    const [config, setConfig] = useState({
        width,
        height,
        length1: 100,
        length2: 100,
        mass1: 1,
        mass2: 1,
        gravity: 9.81,
        damping: 0.01,
        initialAngle1: Math.PI / 4,
        initialAngle2: Math.PI / 2,
        initialVelocity1: 0,
        initialVelocity2: 0
    });

    useEffect(() => {
        if (canvasRef.current) {
            simulationRef.current = new DoublePendulum(canvasRef.current, config);
            simulationRef.current.start();

            return () => {
                simulationRef.current?.stop();
            };
        }
    }, []);

    useEffect(() => {
        if (simulationRef.current) {
            simulationRef.current.updateConfig(config);
        }
    }, [config]);

    const handleConfigChange = (key: keyof typeof config, value: number) => {
        setConfig(prevConfig => ({
            ...prevConfig,
            [key]: value
        }));
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!simulationRef.current) return;

        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        simulationRef.current.handleMouseInteraction(x, y);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!simulationRef.current) return;

        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        simulationRef.current.startMouseInteraction(x, y);
    };

    const handleMouseUp = () => {
        if (!simulationRef.current) return;
        simulationRef.current.stopMouseInteraction();
    };

    return (
        <div className="flex flex-col items-center gap-6 p-6 bg-gray-50 rounded-xl shadow-lg">
            <div className="w-full flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{t('simulation')}</h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setLanguage('en')}
                        className={`px-3 py-1 rounded ${language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        English
                    </button>
                    <button
                        onClick={() => setLanguage('bn')}
                        className={`px-3 py-1 rounded ${language === 'bn' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        বাংলা
                    </button>
                </div>
            </div>
            <p className="text-gray-600 mb-4">{t('description')}</p>
            <div className="relative">
                <canvas
                    ref={canvasRef}
                    width={width}
                    height={height}
                    className="border-2 border-gray-200 rounded-lg bg-white shadow-inner cursor-grab active:cursor-grabbing"
                    onMouseMove={handleMouseMove}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    title={t('dragToInteract')}
                />
            </div>
            <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
                <div className="flex flex-col gap-3 bg-white p-4 rounded-lg shadow">
                    <label className="text-sm font-semibold text-gray-700">
                        {t('length1')}: {config.length1}{t('pixels')}
                    </label>
                    <input
                        type="range"
                        min="50"
                        max="300"
                        value={config.length1}
                        onChange={(e) => handleConfigChange('length1', Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
                <div className="flex flex-col gap-3 bg-white p-4 rounded-lg shadow">
                    <label className="text-sm font-semibold text-gray-700">
                        {t('length2')}: {config.length2}{t('pixels')}
                    </label>
                    <input
                        type="range"
                        min="50"
                        max="300"
                        value={config.length2}
                        onChange={(e) => handleConfigChange('length2', Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
                <div className="flex flex-col gap-3 bg-white p-4 rounded-lg shadow">
                    <label className="text-sm font-semibold text-gray-700">
                        {t('mass1')}: {config.mass1}{t('kilograms')}
                    </label>
                    <input
                        type="range"
                        min="0.1"
                        max="100"
                        step="0.1"
                        value={config.mass1}
                        onChange={(e) => handleConfigChange('mass1', Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
                <div className="flex flex-col gap-3 bg-white p-4 rounded-lg shadow">
                    <label className="text-sm font-semibold text-gray-700">
                        {t('mass2')}: {config.mass2}{t('kilograms')}
                    </label>
                    <input
                        type="range"
                        min="0.1"
                        max="100"
                        step="0.1"
                        value={config.mass2}
                        onChange={(e) => handleConfigChange('mass2', Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
                <div className="flex flex-col gap-3 bg-white p-4 rounded-lg shadow">
                    <label className="text-sm font-semibold text-gray-700">
                        {t('gravity')}: {config.gravity.toFixed(2)}{t('metersPerSecondSquared')}
                    </label>
                    <input
                        type="range"
                        min="0.1"
                        max="100"
                        step="0.1"
                        value={config.gravity}
                        onChange={(e) => handleConfigChange('gravity', Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
                <div className="flex flex-col gap-3 bg-white p-4 rounded-lg shadow">
                    <label className="text-sm font-semibold text-gray-700">
                        {t('damping')}: {config.damping.toFixed(3)}
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="0.5"
                        step="0.001"
                        value={config.damping}
                        onChange={(e) => handleConfigChange('damping', Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
            </div>
        </div>
    );
}; 