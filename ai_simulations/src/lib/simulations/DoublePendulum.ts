import { BaseSimulation, SimulationConfig, SimulationState } from './BaseSimulation';

interface DoublePendulumConfig extends SimulationConfig {
    length1: number;
    length2: number;
    mass1: number;
    mass2: number;
    gravity: number;
    damping: number;
    initialAngle1: number;
    initialAngle2: number;
    initialVelocity1: number;
    initialVelocity2: number;
}

interface DoublePendulumState extends SimulationState {
    angle1: number;
    angle2: number;
    velocity1: number;
    velocity2: number;
}

export class DoublePendulum extends BaseSimulation {
    private config: DoublePendulumConfig;
    private state: DoublePendulumState;
    private readonly pivotX: number;
    private readonly pivotY: number;
    private maxLength: number;
    private isMouseInteracting: boolean = false;
    private selectedMass: 1 | 2 | null = null;
    private readonly simulationSpeed: number = 2.0; // Speed multiplier

    constructor(canvas: HTMLCanvasElement, config: DoublePendulumConfig) {
        super(canvas);
        this.config = {
            width: config.width,
            height: config.height,
            length1: config.length1,
            length2: config.length2,
            mass1: config.mass1,
            mass2: config.mass2,
            gravity: config.gravity,
            damping: config.damping,
            initialAngle1: config.initialAngle1,
            initialAngle2: config.initialAngle2,
            initialVelocity1: config.initialVelocity1,
            initialVelocity2: config.initialVelocity2
        };
        this.pivotX = canvas.width / 2;
        this.pivotY = canvas.height / 3;
        this.maxLength = Math.min(canvas.width, canvas.height) * 0.4;
        this.state = this.initializeState();
    }

    protected initializeState(): DoublePendulumState {
        return {
            angle1: this.config.initialAngle1,
            angle2: this.config.initialAngle2,
            velocity1: this.config.initialVelocity1,
            velocity2: this.config.initialVelocity2
        };
    }

    protected update(deltaTime: number): void {
        // Apply simulation speed
        deltaTime *= this.simulationSpeed;

        // Clamp deltaTime to prevent large jumps
        deltaTime = Math.min(deltaTime, 0.1);

        if (!this.isMouseInteracting) {
            const { length1, length2, mass1, mass2, gravity, damping } = this.config;
            const { angle1, angle2, velocity1, velocity2 } = this.state;

            // Calculate accelerations using the double pendulum equations
            const cos12 = Math.cos(angle1 - angle2);
            const sin12 = Math.sin(angle1 - angle2);
            const sin1 = Math.sin(angle1);
            const sin2 = Math.sin(angle2);

            const denominator = mass1 + mass2 * sin12 * sin12;
            const acceleration1 = (
                -gravity * (2 * mass1 + mass2) * sin1 -
                mass2 * gravity * Math.sin(angle1 - 2 * angle2) -
                2 * sin12 * mass2 * (velocity2 * velocity2 * length2 + velocity1 * velocity1 * length1 * cos12)
            ) / (length1 * denominator);

            const acceleration2 = (
                2 * sin12 * (
                    velocity1 * velocity1 * length1 * (mass1 + mass2) +
                    gravity * (mass1 + mass2) * Math.cos(angle1) +
                    velocity2 * velocity2 * length2 * mass2 * cos12
                )
            ) / (length2 * denominator);

            // Update velocities and angles with damping
            this.state.velocity1 += acceleration1 * deltaTime;
            this.state.velocity2 += acceleration2 * deltaTime;
            this.state.velocity1 *= (1 - damping);
            this.state.velocity2 *= (1 - damping);
            this.state.angle1 += this.state.velocity1 * deltaTime;
            this.state.angle2 += this.state.velocity2 * deltaTime;
        }

        // Keep angles in a reasonable range
        this.state.angle1 = this.state.angle1 % (2 * Math.PI);
        this.state.angle2 = this.state.angle2 % (2 * Math.PI);
    }

    protected render(): void {
        const ctx = this.ctx;
        if (!ctx) return;

        const { length1, length2 } = this.config;
        const { angle1, angle2 } = this.state;

        // Scale lengths to fit within maxLength
        const scale = Math.min(1, this.maxLength / (length1 + length2));
        const scaledLength1 = length1 * scale;
        const scaledLength2 = length2 * scale;

        // Calculate positions
        const x1 = this.pivotX + scaledLength1 * Math.sin(angle1);
        const y1 = this.pivotY + scaledLength1 * Math.cos(angle1);
        const x2 = x1 + scaledLength2 * Math.sin(angle2);
        const y2 = y1 + scaledLength2 * Math.cos(angle2);

        // Clear canvas
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw background grid
        ctx.strokeStyle = '#f0f0f0';
        ctx.lineWidth = 1;
        const gridSize = 20;
        for (let x = 0; x < this.canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y < this.canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.canvas.width, y);
            ctx.stroke();
        }

        // Draw pivot point
        ctx.beginPath();
        ctx.arc(this.pivotX, this.pivotY, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#4a5568';
        ctx.fill();

        // Draw first pendulum
        ctx.beginPath();
        ctx.moveTo(this.pivotX, this.pivotY);
        ctx.lineTo(x1, y1);
        ctx.strokeStyle = '#2d3748';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw first mass
        ctx.beginPath();
        ctx.arc(x1, y1, 8, 0, 2 * Math.PI);
        ctx.fillStyle = this.selectedMass === 1 ? '#2b6cb0' : '#4299e1';
        ctx.fill();
        ctx.strokeStyle = '#2b6cb0';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw second pendulum
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = '#2d3748';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw second mass
        ctx.beginPath();
        ctx.arc(x2, y2, 8, 0, 2 * Math.PI);
        ctx.fillStyle = this.selectedMass === 2 ? '#2f855a' : '#48bb78';
        ctx.fill();
        ctx.strokeStyle = '#2f855a';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw trail
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 + 1, y2 + 1);
        ctx.strokeStyle = 'rgba(72, 187, 120, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    public startMouseInteraction(x: number, y: number): void {
        const { angle1, angle2 } = this.state;
        const { length1, length2 } = this.config;
        const scale = Math.min(1, this.maxLength / (length1 + length2));
        const scaledLength1 = length1 * scale;
        const scaledLength2 = length2 * scale;

        const x1 = this.pivotX + scaledLength1 * Math.sin(angle1);
        const y1 = this.pivotY + scaledLength1 * Math.cos(angle1);
        const x2 = x1 + scaledLength2 * Math.sin(angle2);
        const y2 = y1 + scaledLength2 * Math.cos(angle2);

        const dist1 = Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2));
        const dist2 = Math.sqrt(Math.pow(x - x2, 2) + Math.pow(y - y2, 2));

        if (dist1 < 20) {
            this.selectedMass = 1;
            this.isMouseInteracting = true;
        } else if (dist2 < 20) {
            this.selectedMass = 2;
            this.isMouseInteracting = true;
        }
    }

    public handleMouseInteraction(x: number, y: number): void {
        if (!this.isMouseInteracting || !this.selectedMass) return;

        const dx = x - this.pivotX;
        const dy = y - this.pivotY;
        const angle = Math.atan2(dx, dy);

        if (this.selectedMass === 1) {
            this.state.angle1 = angle;
            this.state.velocity1 = 0;
        } else {
            const { angle1 } = this.state;
            const { length1, length2 } = this.config;
            const scale = Math.min(1, this.maxLength / (length1 + length2));
            const scaledLength1 = length1 * scale;
            const scaledLength2 = length2 * scale;

            const x1 = this.pivotX + scaledLength1 * Math.sin(angle1);
            const y1 = this.pivotY + scaledLength1 * Math.cos(angle1);

            const dx2 = x - x1;
            const dy2 = y - y1;
            this.state.angle2 = Math.atan2(dx2, dy2);
            this.state.velocity2 = 0;
        }
    }

    public stopMouseInteraction(): void {
        this.isMouseInteracting = false;
        this.selectedMass = null;
    }

    public updateConfig(newConfig: Partial<DoublePendulumConfig>): void {
        this.config = { ...this.config, ...newConfig };
        this.maxLength = Math.min(this.canvas.width, this.canvas.height) * 0.4;
    }

    public getState(): DoublePendulumState {
        return { ...this.state };
    }
} 