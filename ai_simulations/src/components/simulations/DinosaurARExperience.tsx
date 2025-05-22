'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import dynamic from 'next/dynamic';

const ThreeScene = dynamic(() => import('@/components/three/ThreeScene'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center w-full h-full">
            <div className="text-lg font-medium text-gray-900">Loading 3D Scene...</div>
        </div>
    ),
});

const DinosaurARExperience: React.FC = () => {
    const { t } = useLanguage();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isARActive, setIsARActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isARActive && videoRef.current) {
            setIsLoading(true);
            setError(null);

            navigator.mediaDevices
                .getUserMedia({ video: { facingMode: 'environment' } })
                .then((stream) => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        setIsLoading(false);
                    }
                })
                .catch((err) => {
                    console.error('Error accessing camera:', err);
                    setError('Failed to access camera. Please ensure camera permissions are granted.');
                    setIsLoading(false);
                    setIsARActive(false);
                });
        }

        return () => {
            if (videoRef.current?.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [isARActive]);

    const startAR = () => {
        setIsARActive(true);
    };

    const stopAR = () => {
        if (videoRef.current?.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach((track) => track.stop());
        }
        setIsARActive(false);
    };

    return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('dinosaurAR.title', 'Dinosaur AR Experience')}
            </h2>

            <div className="relative w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden">
                {isARActive ? (
                    <>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0">
                            <ThreeScene />
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center w-full h-full">
                        {isLoading ? (
                            <div className="text-lg font-medium text-gray-900">
                                {t('dinosaurAR.loading', 'Loading camera...')}
                            </div>
                        ) : error ? (
                            <div className="text-lg font-medium text-red-600">{error}</div>
                        ) : (
                            <div className="text-lg font-medium text-gray-900">
                                {t('dinosaurAR.startPrompt', 'Click Start to begin AR experience')}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex gap-4 mt-6">
                {!isARActive ? (
                    <button
                        onClick={startAR}
                        disabled={isLoading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {t('dinosaurAR.start', 'Start AR')}
                    </button>
                ) : (
                    <button
                        onClick={stopAR}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        {t('dinosaurAR.stop', 'Stop AR')}
                    </button>
                )}
            </div>

            <div className="mt-6 text-gray-900">
                <h3 className="text-lg font-semibold mb-2">
                    {t('dinosaurAR.instructions', 'Instructions')}
                </h3>
                <ul className="list-disc list-inside space-y-2">
                    <li>{t('dinosaurAR.instruction1', 'Click Start to activate your camera')}</li>
                    <li>{t('dinosaurAR.instruction2', 'Point your camera at a flat surface')}</li>
                    <li>{t('dinosaurAR.instruction3', 'The dinosaur will appear in your environment')}</li>
                    <li>{t('dinosaurAR.instruction4', 'Move your device to explore the dinosaur')}</li>
                </ul>
            </div>
        </div>
    );
};

export default DinosaurARExperience; 