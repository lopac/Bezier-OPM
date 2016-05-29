abstract class Bezier implements IBezier, ICanvas {

    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    points: Array<Point>;
    mouse: Mouse;
    canvasBackground: HTMLImageElement;
    pointsCount: number;


    abstract drawBezierCurve();

    drawControlPoint(point: Point): void {

        this.context.setLineDash([0, 0]);
        this.context.fillStyle = "#35465c";
        this.context.lineWidth = 4;
        this.context.beginPath();
        this.context.arc(point.x, point.y, 5, 0, Math.PI * 2, true);
        this.context.strokeStyle = "#7a97e8";
        this.context.closePath();
        this.context.stroke();
        this.context.fill();

    }


    drawLineBetween(p1: Point = null, p2: Point = null): void {

        if (p1 === null || p2 === null) {
            const length = this.points.length;
            p1 = this.points[length - 2];
            p2 = this.points[length - 1];
        }

        this.context.setLineDash([5, 15]);
        this.context.lineWidth = 1.5;
        this.context.strokeStyle = "#ec3a34";
        this.context.beginPath();
        this.context.moveTo(p1.x, p1.y);
        this.context.lineTo(p2.x, p2.y);

        this.context.stroke();
    }

    clearCanvas(): void {
        this.initializeCanvas(this.canvas.width, this.canvas.height, this.canvas);
    }

    renderPoints(): void {
        this.clearCanvas();
        for (let i = 0; i < this.points.length; i++) {

            this.drawControlPoint(this.points[i]);
            if (i + 1 < this.points.length) {
                this.drawLineBetween(this.points[i], this.points[i + 1]);
            }
        }
    };

    createPoint(point: Point): void {

        this.points.push(point);
        this.renderPoints();

    }

    initializeCanvas(width: number, height: number, canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.canvas.width = width;
        this.canvas.height = height;

        this.context = canvas.getContext("2d");

        this.context.fillStyle = this.context.createPattern(this.canvasBackground, "repeat");
        this.context.fillRect(0, 0, width, height);

    }

    getSelectedPointIndex(): number {

        let selected: number = null;
        for (let i = 0; i < this.points.length; i++) {

            const dx = this.points[i].x - this.mouse.x;
            const dy = this.points[i].y - this.mouse.y;

            const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));


            if (distance < 30 && this.mouse.selected === null) {
                selected = i;
            }

        }
        return selected;
    }

    constructor(width: number, height: number, canvas: HTMLCanvasElement, pointsCount: number = null) {

        this.points = new Array<Point>();
        this.mouse = new Mouse();

        this.canvasBackground = new Image();
        this.canvasBackground.src = "/Images/canvasBg.png";

        this.pointsCount = pointsCount;

        this.initializeCanvas(width, height, canvas);

        this.canvasBackground.onload = () => {
            this.initializeCanvas(width, height, canvas);
        };

        this.clearCanvas();

        this.canvas.addEventListener("dblclick",
            (event: MouseEvent) => {

                this.mouse.x = event.offsetX || (event.layerX - canvas.offsetLeft);
                this.mouse.y = event.offsetY || (event.layerY - canvas.offsetTop);

                let newPoint = new Point(
                    this.mouse.x,
                    this.mouse.y
                );
                console.log(JSON.stringify(newPoint));

                if (this.getSelectedPointIndex() == null) {
                    this.createPoint(newPoint);
                } else {
                    this.removePoint(this.getSelectedPointIndex());
                }

            },
            false);

        this.canvas.addEventListener("mousedown",
            (event: MouseEvent) => {
                event.preventDefault();
                this.mouse.mouseDown = true;
                this.mouse.x = event.offsetX || (event.layerX - canvas.offsetLeft);
                this.mouse.y = event.offsetY || (event.layerY - canvas.offsetTop);

                this.mouse.selected = this.getSelectedPointIndex();

            },
            false);

        this.canvas.addEventListener("mouseup",
            (event: MouseEvent) => {
                this.mouse.mouseDown = false;
                this.mouse.selected = null;
            },
            false);

        this.canvas.addEventListener("mousemove",
            (event: MouseEvent) => {


                if (this.mouse.mouseDown && this.mouse.selected != null) {
                    console.log(`selected${this.mouse.selected}`);
                    this.mouse.x = event.offsetX || (event.layerX - canvas.offsetLeft);
                    this.mouse.y = event.offsetY || (event.layerY - canvas.offsetTop);

                    this.points[this.mouse.selected].x = this.mouse.x;
                    this.points[this.mouse.selected].y = this.mouse.y;
                    this.renderPoints();
                }

            },
            false);
    }

    removePoint(selectedPoint: number) {
        this.points.splice(selectedPoint, 1);
        this.renderPoints();
    }
}