'use client';

import React from 'react';
import LabSimulation from '../../../components/lab-simulations/LabSimulation';

const PendulumSimulation = () => {
    const pendulumConfig = {
        // Basic pendulum configuration
        length: 200, // Length of the pendulum in pixels
        gravity: 9.8, // Gravity constant
        damping: 0.1, // Air resistance
        initialAngle: 45, // Initial angle in degrees
        showControls: true, // Show control panel
        showGraph: true, // Show position/velocity graph
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Pendulum Simulation</h1>
            <div className="bg-white rounded-lg shadow-lg p-4">
                <LabSimulation
                    simulationType="pendulum"
                    config={pendulumConfig}
                />
            </div>
            <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">About this Simulation</h2>
                <p className="text-gray-700">
                    This simulation demonstrates a simple pendulum in motion. You can:
                </p>
                <ul className="list-disc list-inside mt-2 text-gray-700">
                    <li>Drag the pendulum to set its initial position</li>
                    <li>Adjust the length and gravity using the controls</li>
                    <li>Observe the position and velocity graphs</li>
                    <li>See how damping affects the motion</li>
                </ul>
            </div>
        </div>
    );
};

export default PendulumSimulation; 