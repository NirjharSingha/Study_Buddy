'use client';

import React, { useEffect, useRef, useState } from 'react';

const ProjectileMotion = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [velocity, setVelocity] = useState(50);
    const [angle, setAngle] = useState(45);
    const [gravity, setGravity] = useState(9.81);
    const [isRunning, setIsRunning] = useState(false);
    const [trajectory, setTrajectory] = useState<{ x: number; y: number }[]>([]);
    const animationRef = useRef<number>();
    const timeRef = useRef(0);

    const resetSimulation = () => {
        setTrajectory([]);
        timeRef.current = 0;
        setIsRunning(false);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const animate = () => {
            if (!ctx || !canvas) return;

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw ground
            ctx.beginPath();
            ctx.moveTo(0, canvas.height - 50);
            ctx.lineTo(canvas.width, canvas.height - 50);
            ctx.strokeStyle = '#fff';
            ctx.stroke();

            // Draw trajectory
            if (trajectory.length > 0) {
                ctx.beginPath();
                ctx.moveTo(trajectory[0].x, trajectory[0].y);
                trajectory.forEach((point) => {
                    ctx.lineTo(point.x, point.y);
                });
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.stroke();
            }

            if (isRunning) {
                const dt = 0.016; // 60 FPS
                timeRef.current += dt;

                // Calculate position
                const vx = velocity * Math.cos((angle * Math.PI) / 180);
                const vy = velocity * Math.sin((angle * Math.PI) / 180) - gravity * timeRef.current;

                const x = 50 + vx * timeRef.current;
                const y = canvas.height - 50 - (vy * timeRef.current - 0.5 * gravity * timeRef.current * timeRef.current);

                // Draw projectile
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, Math.PI * 2);
                ctx.fillStyle = '#4CAF50';
                ctx.fill();

                // Update trajectory
                setTrajectory((prev) => [...prev, { x, y }]);

                // Stop simulation if projectile hits ground
                if (y >= canvas.height - 50) {
                    setIsRunning(false);
                }
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [velocity, angle, gravity, isRunning, trajectory]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-center">Projectile Motion Simulation</h1>

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
                                <label className="block mb-2">Initial Velocity (m/s)</label>
                                <input
                                    type="range"
                                    min="10"
                                    max="100"
                                    value={velocity}
                                    onChange={(e) => setVelocity(Number(e.target.value))}
                                    className="w-full"
                                />
                                <span className="text-sm">{velocity} m/s</span>
                            </div>

                            <div>
                                <label className="block mb-2">Launch Angle (degrees)</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="90"
                                    value={angle}
                                    onChange={(e) => setAngle(Number(e.target.value))}
                                    className="w-full"
                                />
                                <span className="text-sm">{angle}°</span>
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

                            <div className="flex space-x-4">
                                <button
                                    onClick={() => {
                                        resetSimulation();
                                        setIsRunning(true);
                                    }}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                                >
                                    Launch
                                </button>
                                <button
                                    onClick={resetSimulation}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-800/50 backdrop-blur-sm rounded-lg p-6">
                        <h2 className="text-2xl font-semibold mb-4">About Projectile Motion</h2>
                        <p className="text-gray-300">
                            Projectile motion is the motion of an object thrown or projected into the air,
                            subject to only the acceleration of gravity. The object is called a projectile,
                            and its path is called its trajectory.
                        </p>
                        <div className="mt-4">
                            <h3 className="text-xl font-semibold mb-2">Key Concepts:</h3>
                            <ul className="list-disc list-inside text-gray-300 space-y-2">
                                <li>Horizontal and vertical motions are independent</li>
                                <li>Horizontal velocity remains constant</li>
                                <li>Vertical velocity changes due to gravity</li>
                                <li>Maximum range occurs at 45° angle</li>
                                <li>Time of flight depends on initial vertical velocity</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectileMotion; 