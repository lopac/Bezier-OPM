interface ICanvas {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    mouse: Mouse;
    canvasBackground: HTMLImageElement;

    clearCanvas(): void;
    initializeCanvas(width: number, height: number, canvas: HTMLCanvasElement): void;
    createPoint(point: Point);
    removePoint(selectedPoint: number): void;
    getSelectedPointIndex(): number;
}