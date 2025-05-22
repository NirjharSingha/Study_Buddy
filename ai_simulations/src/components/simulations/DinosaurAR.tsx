"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import dynamic from 'next/dynamic';

// Dynamically import Three.js components with no SSR
const ThreeScene = dynamic(() => import('@/components/simulations/ThreeScene'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
    ),
});

export const DinosaurAR: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [isARSupported, setIsARSupported] = useState(false);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [mounted, setMounted] = useState(false);
    const { t } = useLanguage();

    // Set mounted state when component mounts
    useEffect(() => {
        setMounted(true);
    }, []);

    // Initialize dimensions on client-side
    useEffect(() => {
        if (!mounted) return;

        const updateDimensions = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setDimensions({
                    width: rect.width,
                    height: rect.height
                });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);

        return () => {
            window.removeEventListener('resize', updateDimensions);
        };
    }, [mounted]);

    // Check AR support on client-side
    useEffect(() => {
        if (!mounted) return;

        const checkARSupport = async () => {
            try {
                if ('xr' in navigator) {
                    const isSupported = await (navigator.xr as XRSystem).isSessionSupported('immersive-ar');
                    setIsARSupported(isSupported);
                }
            } catch (err) {
                console.log('AR not supported:', err);
                setIsARSupported(false);
            }
        };
        checkARSupport();
    }, [mounted]);

    const startCamera = async () => {
        if (!mounted) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment',
                    width: { ideal: dimensions.width },
                    height: { ideal: dimensions.height }
                }
            });

            setIsCameraActive(true);

            if (!videoRef.current) {
                const video = document.createElement('video');
                video.setAttribute('playsinline', '');
                video.setAttribute('autoplay', '');
                video.style.position = 'absolute';
                video.style.top = '0';
                video.style.left = '0';
                video.style.width = '100%';
                video.style.height = '100%';
                video.style.objectFit = 'cover';
                video.style.zIndex = '1';
                containerRef.current?.appendChild(video);
                videoRef.current = video;
            }

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }
        } catch (err) {
            console.error('Error accessing camera:', err);
            let errorMessage = t('Could not access camera. ');

            if (err instanceof Error) {
                if (err.name === 'NotAllowedError') {
                    errorMessage += t('Please make sure you have granted camera permissions in your browser settings.');
                } else if (err.name === 'NotFoundError') {
                    errorMessage += t('No camera found on your device.');
                } else if (err.name === 'NotReadableError') {
                    errorMessage += t('Your camera is already in use by another application.');
                } else if (err.name === 'OverconstrainedError') {
                    errorMessage += t('Your device does not support the required camera features.');
                } else {
                    errorMessage += err.message;
                }
            }

            setError(errorMessage);
        }
    };

    if (!mounted) {
        return (
            <div className="relative w-full h-full min-h-[300px] flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="relative w-full h-full min-h-[300px] flex items-center justify-center">
            <div ref={containerRef} className="w-full h-full max-w-2xl mx-auto aspect-square">
                {mounted && dimensions.width > 0 && (
                    <ThreeScene
                        loading={loading}
                        setLoading={setLoading}
                        loadingProgress={loadingProgress}
                        setLoadingProgress={setLoadingProgress}
                        setError={setError}
                        dimensions={dimensions}
                    />
                )}
            </div>

            {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white">
                    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-lg">{t('Loading dinosaur model...')} {loadingProgress}%</p>
                </div>
            )}

            {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white p-4 overflow-auto">
                    <p className="text-lg text-center mb-4">{error}</p>
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            {t('Refresh Page')}
                        </button>
                        <button
                            onClick={() => setError(null)}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            {t('Continue without Camera')}
                        </button>
                        <p className="text-sm text-gray-300 text-center mt-4">
                            {t('You can still interact with the 3D model using touch/mouse controls.')}
                        </p>
                    </div>
                </div>
            )}

            {!loading && !error && !isCameraActive && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4 w-full px-4">
                    <button
                        onClick={startCamera}
                        className="w-full max-w-xs px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-lg transition-colors"
                    >
                        {t('Start Camera View')}
                    </button>
                    <p className="text-sm text-gray-600 text-center max-w-xs">
                        {t('You can still interact with the 3D model using touch/mouse controls if camera access is not available.')}
                    </p>
                </div>
            )}
        </div>
    );
}; 