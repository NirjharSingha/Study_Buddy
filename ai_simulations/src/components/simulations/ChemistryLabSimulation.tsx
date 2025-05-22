"use client";
import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import type { ChemicalType, ChemicalColor, LitmusPaper, Beaker, Chemical } from '@/lib/simulations/ChemistryLabClass';

interface ChemistryLabSimulationProps {
    width?: number;
    height?: number;
}

export const ChemistryLabSimulation: React.FC<ChemistryLabSimulationProps> = ({
    width = 800,
    height = 600
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const simulationRef = useRef<any>(null);
    const { t } = useLanguage();
    const [mounted, setMounted] = useState(false);

    const [selectedChemical, setSelectedChemical] = useState<ChemicalType | null>(null);
    const [selectedBeaker, setSelectedBeaker] = useState<number | null>(null);
    const [hoveredBeaker, setHoveredBeaker] = useState<number | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || !canvasRef.current) return;

        // Initialize beakers
        const beakers: Beaker[] = [
            {
                x: 100, y: 300, width: 60, height: 120,
                chemical: { type: 'acid' as ChemicalType, color: 'red' as ChemicalColor, name: 'Hydrochloric Acid', pH: 1 },
                fillLevel: 0.8,
                isHovered: false
            },
            {
                x: 300, y: 300, width: 60, height: 120,
                chemical: { type: 'base' as ChemicalType, color: 'blue' as ChemicalColor, name: 'Sodium Hydroxide', pH: 13 },
                fillLevel: 0.8,
                isHovered: false
            },
            {
                x: 500, y: 300, width: 60, height: 120,
                chemical: { type: 'salt' as ChemicalType, color: 'green' as ChemicalColor, name: 'Sodium Chloride', pH: 7 },
                fillLevel: 0.8,
                isHovered: false
            }
        ];

        // Initialize litmus papers
        const litmusPapers: LitmusPaper[] = [
            {
                x: 550,
                y: 50,
                width: 20,
                height: 30,
                isDragging: false,
                color: 'red',
                originalColor: 'red',
                type: 'red',
                isHovered: false
            },
            {
                x: 100,
                y: 50,
                width: 20,
                height: 30,
                isDragging: false,
                color: 'blue',
                originalColor: 'blue',
                type: 'blue',
                isHovered: false
            }
        ];

        // Import and initialize ChemistryLab only on client side
        import('@/lib/simulations/ChemistryLabClass').then(({ default: ChemistryLab }) => {
            simulationRef.current = new ChemistryLab(canvasRef.current!, {
                width,
                height,
                beakers,
                litmusPapers
            });
            simulationRef.current.start();
        });

        return () => {
            simulationRef.current?.stop();
        };
    }, [mounted, width, height]);

    if (!mounted) {
        return <div className="w-full h-full" />;
    }

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!simulationRef.current) return;

        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check if clicking on a beaker
        const beakerIndex = simulationRef.current.getState().beakers.findIndex((beaker: Beaker) =>
            x >= beaker.x && x <= beaker.x + beaker.width &&
            y >= beaker.y && y <= beaker.y + beaker.height
        );

        if (beakerIndex !== -1 && selectedChemical) {
            setSelectedBeaker(beakerIndex);
        }

        simulationRef.current.startDragging(x, y);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!simulationRef.current) return;

        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        simulationRef.current.handleMouseMove(x, y);
        simulationRef.current.handleDrag(x, y);
    };

    const handleMouseUp = () => {
        if (!simulationRef.current) return;
        simulationRef.current.stopDragging();
    };

    const handleChemicalSelect = (type: ChemicalType) => {
        setSelectedChemical(type);
    };

    const getChemicalColor = (type: ChemicalType): ChemicalColor => {
        switch (type) {
            case 'acid': return 'red';
            case 'base': return 'blue';
            case 'salt': return 'green';
            case 'neutral': return 'clear';
        }
    };

    const getChemicalName = (type: ChemicalType): string => {
        switch (type) {
            case 'acid': return 'Hydrochloric Acid';
            case 'base': return 'Sodium Hydroxide';
            case 'salt': return 'Sodium Chloride';
            case 'neutral': return 'Water';
        }
    };

    const getChemicalPH = (type: ChemicalType): number => {
        switch (type) {
            case 'acid': return 1;
            case 'base': return 13;
            case 'salt': return 7;
            case 'neutral': return 7;
        }
    };

    return (
        <div className="flex flex-col items-center gap-6 p-6 bg-gray-50 rounded-xl shadow-lg">
            <div className="w-full flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{t('chemistryLab')}</h2>
            </div>
            <p className="text-gray-600 mb-4">{t('chemistryLabDescription')}</p>

            <div className="relative">
                <canvas
                    ref={canvasRef}
                    width={width}
                    height={height}
                    className="border-2 border-gray-200 rounded-lg bg-white shadow-inner cursor-pointer"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    title={t('dragToInteract')}
                />
            </div>

            <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
                <div className="flex flex-col gap-3 bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700">{t('chemicals')}</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => handleChemicalSelect('acid')}
                            className={`p-2 rounded transition-colors ${selectedChemical === 'acid'
                                ? 'bg-red-500 text-white'
                                : 'bg-red-100 hover:bg-red-200'
                                }`}
                        >
                            {t('acid')}
                        </button>
                        <button
                            onClick={() => handleChemicalSelect('base')}
                            className={`p-2 rounded transition-colors ${selectedChemical === 'base'
                                ? 'bg-blue-500 text-white'
                                : 'bg-blue-100 hover:bg-blue-200'
                                }`}
                        >
                            {t('base')}
                        </button>
                        <button
                            onClick={() => handleChemicalSelect('salt')}
                            className={`p-2 rounded transition-colors ${selectedChemical === 'salt'
                                ? 'bg-green-500 text-white'
                                : 'bg-green-100 hover:bg-green-200'
                                }`}
                        >
                            {t('salt')}
                        </button>
                        <button
                            onClick={() => handleChemicalSelect('neutral')}
                            className={`p-2 rounded transition-colors ${selectedChemical === 'neutral'
                                ? 'bg-gray-500 text-white'
                                : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                        >
                            {t('neutral')}
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-3 bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700">{t('instructions')}</h3>
                    <ol className="list-decimal list-inside text-gray-600 space-y-2">
                        <li>{t('instruction1')}</li>
                        <li>{t('instruction2')}</li>
                        <li>{t('instruction3')}</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}; 