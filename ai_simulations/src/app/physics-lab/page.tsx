'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const experiments = [
    {
        id: 'pendulum',
        title: 'Simple Pendulum',
        description: 'Explore the motion of a simple pendulum and understand its properties',
        path: '/physics-lab/pendulum'
    },
    {
        id: 'projectile',
        title: 'Projectile Motion',
        description: 'Study the trajectory of projectiles under gravity',
        path: '/physics-lab/projectile'
    },
    {
        id: 'spring',
        title: 'Spring Oscillator',
        description: 'Investigate harmonic motion with a spring-mass system',
        path: '/physics-lab/spring'
    },
    {
        id: 'solar-system',
        title: 'Solar System',
        description: 'Explore our solar system with interactive planet simulations',
        path: '/physics-lab/solar-system'
    }
];

export default function PhysicsLab() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white p-8">
            <h1 className="text-4xl font-bold mb-8 text-center">Physics Lab Simulator</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {experiments.map((experiment) => (
                    <motion.div
                        key={experiment.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-800/50 backdrop-blur-sm rounded-lg p-6 shadow-xl"
                    >
                        <h2 className="text-2xl font-semibold mb-3">{experiment.title}</h2>
                        <p className="text-gray-300 mb-4">{experiment.description}</p>
                        <Link
                            href={experiment.path}
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                            Launch Experiment
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
} 