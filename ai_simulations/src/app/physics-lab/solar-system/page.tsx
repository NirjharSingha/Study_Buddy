'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Planet {
    name: string;
    color: string;
    radius: number;
    distance: number;
    speed: number;
    info: string;
}

const planets: Planet[] = [
    {
        name: 'Mercury',
        color: '#A9A9A9',
        radius: 10,
        distance: 60,
        speed: 0.04,
        info: "Mercury is the smallest and innermost planet in the Solar System. Its orbital period around the Sun is 87.97 days, the shortest of all planets."
    },
    {
        name: 'Venus',
        color: '#E6E6FA',
        radius: 15,
        distance: 90,
        speed: 0.015,
        info: "Venus is the second planet from the Sun and is Earth's closest planetary neighbor. It's one of the four inner, terrestrial planets."
    },
    {
        name: 'Earth',
        color: '#4169E1',
        radius: 16,
        distance: 120,
        speed: 0.01,
        info: "Earth is the third planet from the Sun and the only astronomical object known to harbor life. About 71% of Earth's surface is covered with water."
    },
    {
        name: 'Mars',
        color: '#CD5C5C',
        radius: 12,
        distance: 150,
        speed: 0.008,
        info: "Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System. It's often called the 'Red Planet' due to its reddish appearance."
    },
    {
        name: 'Jupiter',
        color: '#DEB887',
        radius: 30,
        distance: 200,
        speed: 0.004,
        info: "Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass more than two and a half times that of all the other planets combined."
    },
    {
        name: 'Saturn',
        color: '#F4A460',
        radius: 25,
        distance: 250,
        speed: 0.003,
        info: "Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter. It is known for its prominent ring system."
    }
];

const SolarSystem = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
    const [isRunning, setIsRunning] = useState(true);
    const animationRef = useRef<number>();
    const angles = useRef<number[]>(planets.map(() => Math.random() * Math.PI * 2));

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const animate = () => {
            if (!ctx || !canvas) return;

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw sun
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, 40, 0, Math.PI * 2);
            ctx.fillStyle = '#FFD700';
            ctx.fill();

            // Draw orbits and planets
            planets.forEach((planet, index) => {
                // Draw orbit
                ctx.beginPath();
                ctx.arc(canvas.width / 2, canvas.height / 2, planet.distance, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.stroke();

                // Update angle
                if (isRunning) {
                    angles.current[index] += planet.speed;
                }

                // Calculate planet position
                const x = canvas.width / 2 + planet.distance * Math.cos(angles.current[index]);
                const y = canvas.height / 2 + planet.distance * Math.sin(angles.current[index]);

                // Draw planet
                ctx.beginPath();
                ctx.arc(x, y, planet.radius, 0, Math.PI * 2);
                ctx.fillStyle = planet.color;
                ctx.fill();

                // Draw planet name
                ctx.fillStyle = '#fff';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(planet.name, x, y - planet.radius - 5);
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isRunning]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-center">Solar System Simulation</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-blue-800/50 backdrop-blur-sm rounded-lg p-6 shadow-xl">
                            <canvas
                                ref={canvasRef}
                                width={800}
                                height={600}
                                className="w-full bg-black/50 rounded-lg"
                            />
                            <div className="mt-4 flex justify-center">
                                <button
                                    onClick={() => setIsRunning(!isRunning)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                                >
                                    {isRunning ? 'Pause' : 'Resume'} Simulation
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-800/50 backdrop-blur-sm rounded-lg p-6">
                        <h2 className="text-2xl font-semibold mb-4">Planet Information</h2>
                        <div className="space-y-4">
                            {planets.map((planet) => (
                                <div
                                    key={planet.name}
                                    className={`p-4 rounded-lg cursor-pointer transition-colors ${selectedPlanet?.name === planet.name
                                        ? 'bg-blue-600'
                                        : 'bg-blue-700/50 hover:bg-blue-700'
                                        }`}
                                    onClick={() => setSelectedPlanet(planet)}
                                >
                                    <h3 className="text-xl font-semibold">{planet.name}</h3>
                                    {selectedPlanet?.name === planet.name && (
                                        <p className="mt-2 text-gray-200">{planet.info}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SolarSystem; 