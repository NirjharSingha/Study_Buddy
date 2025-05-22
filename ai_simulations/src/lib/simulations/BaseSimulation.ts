export interface SimulationConfig {
    width: number;
    height: number;
}

export interface SimulationState {
    // Base state properties can be added here
}

export abstract class BaseSimulation {
    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D | null;
    protected animationFrameId: number | null = null;
    protected isRunning: boolean = false;
    protected lastUpdateTime: number = 0;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        if (!this.ctx) {
            throw new Error('Could not get canvas context');
        }
    }

    protected abstract initializeState(): SimulationState;
    protected abstract update(deltaTime: number): void;
    protected abstract render(): void;

    public start(): void {
        if (!this.isRunning) {
            this.isRunning = true;
            this.lastUpdateTime = performance.now();
            this.animate();
        }
    }

    public stop(): void {
        if (this.isRunning) {
            this.isRunning = false;
            if (this.animationFrameId !== null) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }
        }
    }

    protected animate(): void {
        if (!this.isRunning) return;

        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastUpdateTime) / 1000; // Convert to seconds
        this.lastUpdateTime = currentTime;

        this.update(deltaTime);
        this.render();

        this.animationFrameId = requestAnimationFrame(() => this.animate());
    }

    public abstract updateConfig(newConfig: Partial<SimulationConfig>): void;
    public abstract getState(): SimulationState;

    // Mouse interaction methods
    public startDragging(x: number, y: number): void {
        // Base implementation does nothing
    }

    public handleMouseMove(x: number, y: number): void {
        // Base implementation does nothing
    }

    public handleDrag(x: number, y: number): void {
        // Base implementation does nothing
    }

    public stopDragging(): void {
        // Base implementation does nothing
    }
} 