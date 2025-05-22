"use client";

import React from 'react';
import { DoublePendulumSimulation } from '@/components/simulations/DoublePendulumSimulation';

export default function DoublePendulumPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <DoublePendulumSimulation />
        </div>
    );
} 