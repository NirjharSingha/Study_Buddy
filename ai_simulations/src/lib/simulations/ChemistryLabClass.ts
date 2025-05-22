export type ChemicalType = 'acid' | 'base' | 'salt' | 'neutral';
export type ChemicalColor = 'red' | 'blue' | 'green' | 'clear';

export interface Chemical {
    type: ChemicalType;
    color: ChemicalColor;
    name: string;
    pH: number;
}

export interface Beaker {
    x: number;
    y: number;
    width: number;
    height: number;
    chemical: Chemical;
    fillLevel: number;
    isHovered: boolean;
}

export interface LitmusPaper {
    x: number;
    y: number;
    width: number;
    height: number;
    isDragging: boolean;
    color: string;
    originalColor: string;
    type: string;
    isHovered: boolean;
    isInBeaker: boolean;
    currentBeakerIndex: number | null;
}

export interface ChemistryLabState {
    beakers: Beaker[];
    litmusPapers: LitmusPaper[];
}

export default class ChemistryLab {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private state: ChemistryLabState;
    private animationFrameId: number | null = null;
    private isDragging: boolean = false;
    private draggedItem: LitmusPaper | null = null;

    constructor(canvas: HTMLCanvasElement, options: {
        width: number;
        height: number;
        beakers?: Beaker[];
        litmusPapers?: LitmusPaper[];
    }) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;

        // Initialize default state
        this.state = {
            beakers: options.beakers || [
                {
                    x: 100, y: 300, width: 60, height: 120,
                    chemical: { type: 'acid', color: 'red', name: 'Hydrochloric Acid', pH: 1 },
                    fillLevel: 0.8,
                    isHovered: false
                },
                {
                    x: 300, y: 300, width: 60, height: 120,
                    chemical: { type: 'base', color: 'blue', name: 'Sodium Hydroxide', pH: 13 },
                    fillLevel: 0.8,
                    isHovered: false
                },
                {
                    x: 500, y: 300, width: 60, height: 120,
                    chemical: { type: 'salt', color: 'green', name: 'Sodium Chloride', pH: 7 },
                    fillLevel: 0.8,
                    isHovered: false
                }
            ],
            litmusPapers: options.litmusPapers || [
                {
                    x: 550, y: 50, width: 20, height: 30,
                    isDragging: false,
                    color: 'red',
                    originalColor: 'red',
                    type: 'red',
                    isHovered: false,
                    isInBeaker: false,
                    currentBeakerIndex: null
                },
                {
                    x: 100, y: 50, width: 20, height: 30,
                    isDragging: false,
                    color: 'blue',
                    originalColor: 'blue',
                    type: 'blue',
                    isHovered: false,
                    isInBeaker: false,
                    currentBeakerIndex: null
                }
            ]
        };
    }

    start(): void {
        this.animate();
    }

    stop(): void {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    getState(): ChemistryLabState {
        return this.state;
    }

    private animate(): void {
        this.render();
        this.animationFrameId = requestAnimationFrame(() => this.animate());
    }

    update(deltaTime: number): void {
        // Update simulation state if needed
    }

    private updateLitmusPaperColor(paper: LitmusPaper, beaker: Beaker): void {
        if (!paper.isInBeaker) {
            return;
        }

        // Red litmus paper turns blue in base, stays red in acid
        // Blue litmus paper turns red in acid, stays blue in base
        if (paper.type === 'red') {
            paper.color = beaker.chemical.type === 'base' ? 'blue' : 'red';
        } else if (paper.type === 'blue') {
            paper.color = beaker.chemical.type === 'acid' ? 'red' : 'blue';
        }
    }

    private checkLitmusPaperInBeaker(paper: LitmusPaper): void {
        const beakerIndex = this.state.beakers.findIndex(beaker => {
            const paperBottom = paper.y + paper.height;
            const beakerTop = beaker.y;
            const paperMiddle = paper.x + paper.width / 2;
            const beakerLeft = beaker.x;
            const beakerRight = beaker.x + beaker.width;

            return paperBottom >= beakerTop &&
                paperBottom <= beakerTop + beaker.height * beaker.fillLevel &&
                paperMiddle >= beakerLeft &&
                paperMiddle <= beakerRight;
        });

        if (beakerIndex !== -1) {
            paper.isInBeaker = true;
            paper.currentBeakerIndex = beakerIndex;
            this.updateLitmusPaperColor(paper, this.state.beakers[beakerIndex]);
        } else {
            paper.isInBeaker = false;
            paper.currentBeakerIndex = null;
        }
    }

    render(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw beakers
        this.state.beakers.forEach(beaker => {
            // Draw beaker outline
            this.ctx.strokeStyle = beaker.isHovered ? '#4a90e2' : '#666';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(beaker.x, beaker.y, beaker.width, beaker.height);

            // Draw chemical
            const fillHeight = beaker.height * beaker.fillLevel;
            this.ctx.fillStyle = beaker.chemical.color;
            this.ctx.fillRect(
                beaker.x + 2,
                beaker.y + beaker.height - fillHeight,
                beaker.width - 4,
                fillHeight
            );
        });

        // Draw litmus papers
        this.state.litmusPapers.forEach(paper => {
            this.ctx.fillStyle = paper.color;
            this.ctx.fillRect(paper.x, paper.y, paper.width, paper.height);
            this.ctx.strokeStyle = '#666';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(paper.x, paper.y, paper.width, paper.height);
        });
    }

    startDragging(x: number, y: number): void {
        // Check if clicking on a litmus paper
        const paper = this.state.litmusPapers.find(p =>
            x >= p.x && x <= p.x + p.width &&
            y >= p.y && y <= p.y + p.height
        );

        if (paper) {
            this.isDragging = true;
            this.draggedItem = paper;
            paper.isDragging = true;
        }
    }

    handleDrag(x: number, y: number): void {
        if (this.isDragging && this.draggedItem) {
            this.draggedItem.x = x - this.draggedItem.width / 2;
            this.draggedItem.y = y - this.draggedItem.height / 2;
            this.checkLitmusPaperInBeaker(this.draggedItem);
        }
    }

    stopDragging(): void {
        if (this.draggedItem) {
            this.draggedItem.isDragging = false;
            this.draggedItem = null;
        }
        this.isDragging = false;
    }

    handleMouseDown(x: number, y: number): void {
        this.startDragging(x, y);
    }

    handleMouseMove(x: number, y: number): void {
        // Update hover states
        this.state.beakers.forEach(beaker => {
            beaker.isHovered =
                x >= beaker.x && x <= beaker.x + beaker.width &&
                y >= beaker.y && y <= beaker.y + beaker.height;
        });

        this.state.litmusPapers.forEach(paper => {
            paper.isHovered =
                x >= paper.x && x <= paper.x + paper.width &&
                y >= paper.y && y <= paper.y + paper.height;
        });

        if (this.isDragging) {
            this.handleDrag(x, y);
        }
    }

    handleMouseUp(): void {
        this.stopDragging();
    }
} 