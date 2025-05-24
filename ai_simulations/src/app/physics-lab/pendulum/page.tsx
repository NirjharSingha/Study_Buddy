'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const PendulumSimulation = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [length, setLength] = useState(200);
    const [angle, setAngle] = useState(Math.PI / 4);
    const [gravity, setGravity] = useState(9.81);
    const [isRunning, setIsRunning] = useState(false);
    const animationRef = useRef<number>();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let time = 0;
        const dt = 0.016; // 60 FPS

        const animate = () => {
            if (!ctx || !canvas) return;

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Calculate pendulum position
            const x = canvas.width / 2 + length * Math.sin(angle);
            const y = canvas.height / 4 + length * Math.cos(angle);

            // Draw pivot point
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 4, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.fill();

            // Draw string
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, canvas.height / 4);
            ctx.lineTo(x, y);
            ctx.strokeStyle = '#fff';
            ctx.stroke();

            // Draw bob
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2);
            ctx.fillStyle = '#4CAF50';
            ctx.fill();

            if (isRunning) {
                // Update angle using simple pendulum equation
                const angularAcceleration = -(gravity / length) * Math.sin(angle);
                const angularVelocity = angularAcceleration * dt;
                setAngle(prev => prev + angularVelocity);
                time += dt;
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [length, gravity, isRunning]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-center">Simple Pendulum Simulation</h1>

                <div className="bg-blue-800/50 backdrop-blur-sm rounded-lg p-6 shadow-xl mb-8">
                    <canvas
                        ref={canvasRef}
                        width={800}
                        height={600}
                        className="w-full bg-black/50 rounded-lg"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-800/50 backdrop-blur-sm rounded-lg p-6">
                        <h2 className="text-2xl font-semibold mb-4">Controls</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block mb-2">Pendulum Length (pixels)</label>
                                <input
                                    type="range"
                                    min="100"
                                    max="300"
                                    value={length}
                                    onChange={(e) => setLength(Number(e.target.value))}
                                    className="w-full"
                                />
                                <span className="text-sm">{length}px</span>
                            </div>

                            <div>
                                <label className="block mb-2">Gravity (m/s²)</label>
                                <input
                                    type="range"
                                    min="1"
                                    max="20"
                                    step="0.1"
                                    value={gravity}
                                    onChange={(e) => setGravity(Number(e.target.value))}
                                    className="w-full"
                                />
                                <span className="text-sm">{gravity} m/s²</span>
                            </div>

                            <button
                                onClick={() => setIsRunning(!isRunning)}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                            >
                                {isRunning ? 'Pause' : 'Start'} Simulation
                            </button>
                        </div>
                    </div>

                    <div className="bg-blue-800/50 backdrop-blur-sm rounded-lg p-6">
                        <h2 className="text-2xl font-semibold mb-4">About Simple Pendulum</h2>
                        <p className="text-gray-300">
                            A simple pendulum consists of a mass (bob) suspended from a fixed point by a string or rod.
                            When displaced from its equilibrium position, it swings back and forth under the influence of gravity.
                            The period of oscillation depends on the length of the pendulum and the acceleration due to gravity.
                        </p>
                        <div className="mt-4">
                            <h3 className="text-xl font-semibold mb-2">Key Concepts:</h3>
                            <ul className="list-disc list-inside text-gray-300 space-y-2">
                                <li>Period is independent of the mass of the bob</li>
                                <li>Period is proportional to the square root of the length</li>
                                <li>Small angle approximation: sin(θ) ≈ θ</li>
                                <li>Energy conservation between potential and kinetic energy</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PendulumSimulation; 