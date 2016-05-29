/// <reference path="../Bezier/Scripts/typings/jquery/jquery.ts" />

class Point {
    x;
    y;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }
}

class Vector {
    x;
    y;
    z;

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class Mouse {
    mouseDown = false;
    selected: number = null;
    x = 0;
    y = 0;
}


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

interface IBezier {
    points: Array<Point>;
    drawControlPoint(point: Point): void;
    drawLineBetween(p1: Point, p2: Point): void;

}


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


class BezierSeparation extends Bezier {


    drawButton: HTMLAnchorElement = null;
    curveDrawed = false;
    curveSeparated = false;
    sIndex: number;

    computeBezierPoint(count: number, i: number, u: number, p: Array<Point>): Point {
        if (count === 0) {
            return p[i];
        }

        let p1 = this.computeBezierPoint(count - 1, i, u, p);
        let p2 = this.computeBezierPoint(count - 1, i + 1, u, p);

        return new Point(((1 - u) * p1.x + u * p2.x), ((1 - u) * p1.y + u * p2.y));
    }

    drawBezierCurve(points: Array<Point> = null) {
        this.context.setLineDash([0, 0]);
        this.context.lineWidth = 2;
        this.context.strokeStyle = "#be574e";

        let p = points === null ? this.points : points;

        this.context.moveTo(p[0].x, p[0].y);

        for (let i = 0; i <= 1; i += 0.005) {
            const point = this.computeBezierPoint(p.length - 1, 0, i, p);
            this.context.lineTo(point.x, point.y);
        }


        this.context.stroke();

        if (this.curveDrawed === false) {
            this.curveDrawed = true;
            $("#taskBtns").empty();
        }
    }

    createPoint(point: Point): void {

        if (this.points.length < 15 && this.curveDrawed === false) {
            super.createPoint(point);
        }

        //if (this.curveDrawed) {
        //    super.createPoint(point);
        //    this.seperateCurve(point);
        //}

        if (this.drawButton === null && this.points.length > 2) {
            this.drawButton = document.createElement("a");
            this.drawButton.className = "btn btn-primary";
            this.drawButton.innerHTML = "Nacrtaj krivulju";

            this.drawButton.onclick = () => this.drawBezierCurve();

            $("#taskBtns").append(this.drawButton);

        }


    }

    renderPoints(): void {

        if (this.curveSeparated) {
            this.seperateCurve();
        } else {
            super.renderPoints();
            if (this.curveDrawed) {

                this.drawBezierCurve();
            }
        }

    }

    removePoint(selectedPoint: number) {
        this.sIndex = selectedPoint;
        this.seperateCurve();
    }

    seperateCurve() {

        this.clearCanvas();

        let p1 = new Array<Point>();
        let p2 = new Array<Point>();

        for (let i = 1; i < this.points.length; i++) {
            this.drawLineBetween(this.points[i - 1], this.points[i]);
        }

        for (let i = 0; i <= this.sIndex; i++) {
            this.drawControlPoint(this.points[i]);
            p1.push(this.points[i]);

        }



        this.drawBezierCurve(p1);

        for (let i = this.sIndex; i < this.points.length; i++) {
            this.drawControlPoint(this.points[i]);
            p2.push(this.points[i]);
        }

        this.drawBezierCurve(p2);

        this.curveSeparated = true;
    }

}

class QuadriaticBezier extends Bezier {

    drawControlPoint(point: Point) {
        super.drawControlPoint(point);

        if (this.points.length === 4) {
            this.drawBezierCurve();
        }

    }

    drawBezierCurve() {
        this.context.setLineDash([0, 0]);
        this.context.lineWidth = 3;
        this.context.strokeStyle = "#be574e";

        this.context.moveTo(this.points[0].x, this.points[0].y);

        for (let i = 0; i < 1; i += 0.01) {
            let point = this.computeBezierPoint(i);
            this.context.lineTo(point.x, point.y);
        }

        this.context.stroke();
    }

    computeBezierPoint(t: number) {
        let cX = 3 * (this.points[1].x - this.points[0].x);
        let bX = 3 * (this.points[2].x - this.points[1].x) - cX;
        let aX = this.points[3].x - this.points[0].x - cX - bX;

        let cY = 3 * (this.points[1].y - this.points[0].y);
        let bY = 3 * (this.points[2].y - this.points[1].y) - cY;
        let aY = this.points[3].y - this.points[0].y - cY - bY;

        let point = new Point();

        point.x = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t) + this.points[0].x;
        point.y = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t) + this.points[0].y;

        return point;
    }

    createPoint(point: Point): void {
        if (this.points.length < this.pointsCount) {
            super.createPoint(point);
        }
    }
}


class NBezier extends Bezier {

    drawButton: HTMLAnchorElement = null;
    curveDrawed = false;

    computeBezierPoint(count: number, i?: number, u?: number): Point {
        if (count === 0) {
            return this.points[i];
        }

        let p1 = this.computeBezierPoint(count - 1, i, u);
        let p2 = this.computeBezierPoint(count - 1, i + 1, u);

        return new Point(((1 - u) * p1.x + u * p2.x), ((1 - u) * p1.y + u * p2.y));
    }

    drawBezierCurve() {
        this.context.setLineDash([0, 0]);
        this.context.lineWidth = 2;
        this.context.strokeStyle = "#be574e";

        this.context.moveTo(this.points[0].x, this.points[0].y);

        for (let i = 0; i <= 1; i += 0.005) {
            let point = this.computeBezierPoint(this.points.length - 1, 0, i);
            this.context.lineTo(point.x, point.y);
        }
        console.log("DBC");
        this.context.stroke();
        if (this.curveDrawed === false) {
            this.curveDrawed = true;
            $("#taskBtns").empty();
        }
    }

    createPoint(point: Point): void {

        if (this.points.length < 10) {
            super.createPoint(point);
            console.log("CP");
        }

        if (this.drawButton === null && this.points.length > 2) {
            this.drawButton = document.createElement("a");
            this.drawButton.className = "btn btn-primary";
            this.drawButton.innerHTML = "Nacrtaj krivulju";

            this.drawButton.onclick = () => this.drawBezierCurve();

            $("#taskBtns").append(this.drawButton);
            console.log("IF");
        }


    }

    renderPoints(): void {
        super.renderPoints();
        console.log("REBDER");
        if (this.curveDrawed) {
            this.drawBezierCurve();
        }
    }


}

interface IDeCasteljau<T> {

    points: Array<T>;
    addPointBtn: HTMLAnchorElement;
    computeBtn: HTMLAnchorElement;
    pointsCount;
    u: number;
    breakline;

    showResult(rPoint: T): void;
    compute(): void;

}

// ReSharper disable InconsistentNaming
class DeCasteljauApi {
    U: number;
    Points: Array<Point>;

    constructor(u: number, points: Array<Point>) {
        this.U = u;
        this.Points = points;
    }
}
// ReSharper restore InconsistentNaming



class DeCasteljau implements IDeCasteljau<Point> {

    points: Array<Point>;

    addPointBtn: HTMLAnchorElement;
    computeBtn: HTMLAnchorElement;
    pointsCount = 0;
    u: number = 0;

    breakline = document.createElement("br");


    constructor() {

        this.points = new Array<Point>();
      

        let form = document.createElement("div");
        form.className = "form-group";

        let label = document.createElement("h5");
        label.className = "control-label";
        label.innerHTML = "Unesite u";

        let input = document.createElement("input");
        input.className = "form-control";
        input.id = "u";
        input.type = "number";
        input.value = "Unesite u..";



        form.appendChild(label);

        form.appendChild(input);

        $("#taskCom").css("width", 200).append(form).append(this.breakline);


        this.addPointBtn = document.createElement("a");
        this.addPointBtn.className = "btn btn-primary";
        this.addPointBtn.innerHTML = "Dodaj točku";
        this.addPointBtn.onclick = () => this.addPoint();

        this.computeBtn = document.createElement("a");
        this.computeBtn.className = "btn btn-success";
        this.computeBtn.id = "computeBtn";
        this.computeBtn.innerHTML = "Izracunaj";

        this.computeBtn.onclick = () => {

            let point = new Point();

            point.x = Number($(`#p${this.pointsCount}x`).val());
            point.y = Number($(`#p${this.pointsCount}y`).val());

            this.points.push(point);

          this.compute();
        
        };


        $("#taskBtns").append(this.addPointBtn);

    }

    private toFixed(n: number) {
        return parseFloat((n).toFixed(2)).toString();
    }

    showResult(rPoint: Point): void {
       
        let pointForm = document.createElement("div");
        pointForm.className = "form-group has-success";

        let formLabel = document.createElement("h5");
        formLabel.className = "control-label";
        formLabel.innerHTML = "Rezultantna tocka";

        let x = document.createElement("input");
        x.className = "form-control";
        x.disabled = true;
        x.type = "number";
        x.value = this.toFixed(rPoint.x);

        let y = document.createElement("input");
        y.className = "form-control";
        y.disabled = true;
        y.type = "number";
        y.value = this.toFixed(rPoint.y);


        pointForm.appendChild(formLabel);
        pointForm.appendChild(this.breakline);
        pointForm.appendChild(x);
        pointForm.appendChild(this.breakline);
        pointForm.appendChild(y);

        if (this.addPointBtn != null && this.computeBtn != null) {
            this.addPointBtn.remove();
            this.computeBtn.remove();
        }

        $("#taskCom").append(pointForm).append(this.breakline);
        $("#taskBtns").empty();

    }

    compute(): void {

        let apiModel = new DeCasteljauApi(this.u, this.points);
        $.ajax({
            type: "POST",
            data: JSON.stringify(apiModel),
            url: "/api/DeCasteljau",
            contentType: "application/json"
        }).done(result => {
            this.showResult(new Point(result.X,result.Y));
        });

       
    }

    addPoint(): void {

        if (this.pointsCount !== 0) {


            let point = new Point();

            point.x = Number($(`#p${this.pointsCount}x`).val());
            point.y = Number($(`#p${this.pointsCount}y`).val());

            this.points.push(point);

        } else {

            this.u = Number($("#u").val());
            if (this.u > 1) {
                alert("Parametar u ne smije biti veći od 1!");
            }

        }


        let pointForm = document.createElement("div");
        pointForm.className = "form-group";

        let formLabel = document.createElement("h5");
        formLabel.className = "control-label";
        formLabel.innerHTML = `Točka P${++this.pointsCount}`;

        let inputX = document.createElement("input");
        inputX.className = "form-control";
        inputX.id = `p${this.pointsCount}x`;
        inputX.type = "number";
        inputX.placeholder = "Unesite x..";
        inputX.value = (Math.floor(Math.random() * 100) + 1).toString();


        let inputY = document.createElement("input");
        inputY.className = "form-control";
        inputY.id = `p${this.pointsCount}y`;
        inputY.type = "number";
        inputY.value = (Math.floor(Math.random() * 100) + 1).toString();
        inputY.placeholder = "Unesite y..";


        pointForm.appendChild(formLabel);
        pointForm.appendChild(this.breakline);
        pointForm.appendChild(inputX);
        pointForm.appendChild(this.breakline);
        pointForm.appendChild(inputY);

        $("#taskCom").append(pointForm).append(this.breakline);


    }


}

class DeCasteljauPoint implements IDeCasteljau<Point> {

    points: Array<Point>;
    addPointBtn: HTMLAnchorElement;
    computeBtn: HTMLAnchorElement;
    pointsCount: number = 0;
    u: number;
    breakline = document.createElement("br");


    private toFixed(n: number) {
        return parseFloat((n).toFixed(2)).toString();
    }


    constructor(u:number) {
        this.u = u;

        this.addPoint(new Point(0,1));
        this.addPoint(new Point(1,2));
        this.addPoint(new Point(4,0));
        this.addPoint(new Point(3,0));

        this.compute();
    }

    addPoint(p: Point): void {

        this.points.push(p);

        let pointForm = document.createElement("div");
        pointForm.className = "form-group";

        let formLabel = document.createElement("h5");
        formLabel.className = "control-label";
        formLabel.innerHTML = `Točka P${this.pointsCount++}`;

        let inputX = document.createElement("input");
        inputX.className = "form-control";
        inputX.id = `p${this.pointsCount}x`;
        //inputX.type = "number";
        inputX.value = p.x;
        inputX.disabled = true;


        let inputY = document.createElement("input");
        inputY.className = "form-control";
        inputY.id = `p${this.pointsCount}y`;
        //inputY.type = "number";
        inputX.value = p.y;
        inputX.disabled = true;


        pointForm.appendChild(formLabel);
        pointForm.appendChild(this.breakline);
        pointForm.appendChild(inputX);
        pointForm.appendChild(this.breakline);
        pointForm.appendChild(inputY);

        $("#taskCom").append(pointForm).append(this.breakline);
    }

    showResult(rPoint: Point): void {

        let pointForm = document.createElement("div");
        pointForm.className = "form-group has-success";

        let formLabel = document.createElement("h5");
        formLabel.className = "control-label";
        formLabel.innerHTML = "Rezultantna tocka";

        let x = document.createElement("input");
        x.className = "form-control";
        x.disabled = true;
        x.type = "number";
        x.value = this.toFixed(rPoint.x);

        let y = document.createElement("input");
        y.className = "form-control";
        y.disabled = true;
        y.type = "number";
        y.value = this.toFixed(rPoint.y);


        pointForm.appendChild(formLabel);
        pointForm.appendChild(this.breakline);
        pointForm.appendChild(x);
        pointForm.appendChild(this.breakline);
        pointForm.appendChild(y);

        if (this.addPointBtn != null && this.computeBtn != null) {
            this.addPointBtn.remove();
            this.computeBtn.remove();
        }

        $("#taskCom").append(pointForm).append(this.breakline);
        $("#taskBtns").empty();
    }

    compute(): void {
        let apiModel = new DeCasteljauApi(this.u, this.points);

        $.ajax({
            type: "POST",
            data: JSON.stringify(apiModel),
            url: "/api/DeCasteljau",
            contentType: "application/json"
        }).done(result => {
            this.showResult(new Point(result.X, result.Y));
        });
    }

 
}

class DeCasteljauVector implements IDeCasteljau<Vector> {

    points: Array<Vector>;
    resultPoints: Array<Vector>;
    addPointBtn: HTMLAnchorElement;
    computeBtn: HTMLAnchorElement;
    pointsCount = 0;
    u: number = 0;
    breakline = document.createElement("br");

    public constructor(uVal: number) {

        this.points = new Array<Vector>();
        this.resultPoints = new Array<Vector>();

        let form = document.createElement("div");
        form.className = "form-group";

        let label = document.createElement("h5");
        label.className = "control-label";
        label.innerHTML = "u";

        let u = document.createElement("input");
        u.className = "form-control";
        u.id = "u";
        u.type = "number";
        u.disabled = true;
        u.value = uVal.toString();

        this.u = uVal;

        form.appendChild(label);
        form.appendChild(u);

        $("#taskCom").append(form).append(this.breakline);


        this.addPoint(new Vector(0, 1, 2));
        this.addPoint(new Vector(1, 2, 8 / 3));
        this.addPoint(new Vector(11 / 3, 4 / 3, 14 / 3));
        this.addPoint(new Vector(4, 1, 5));

        this.compute();


    }

    addPoint(point: Vector): void;
    addPoint(): void;
    addPoint(point?: Vector): void {

        this.points.push(point);

        let pointForm = document.createElement("div");
        pointForm.className = "form-group";

        let formLabel = document.createElement("h5");
        formLabel.className = "control-label";
        formLabel.innerHTML = `Točka P${++this.pointsCount}`;

        let x = document.createElement("input");
        x.className = "form-control";
        x.id = `p${this.pointsCount}x`;
        x.type = "number";
        x.disabled = true;
        x.value = point.x;

        let y = document.createElement("input");
        y.className = "form-control";
        y.id = `p${this.pointsCount}y`;
        y.type = "number";
        y.value = point.y;
        y.disabled = true;

        let z = document.createElement("input");
        z.className = "form-control";
        z.id = `p${this.pointsCount}z`;
        z.type = "number";
        z.value = point.z;
        z.disabled = true;


        pointForm.appendChild(formLabel);
        pointForm.appendChild(this.breakline);
        pointForm.appendChild(x);
        pointForm.appendChild(this.breakline);
        pointForm.appendChild(y);
        pointForm.appendChild(this.breakline);
        pointForm.appendChild(z);


        $("#taskCom").append(pointForm).append(this.breakline);

    }

    compute(): void {

        for (let i = this.points.length - 1; i > 0; i--) {
            for (let j = 0; j < i; j++) {

                this.resultPoints[j] = new Vector();

                if (i === this.points.length - 1) {
                    this.resultPoints[j].x = (1 - this.u) * this.points[j].x + this.u * this.points[j + 1].x;
                    this.resultPoints[j].y = (1 - this.u) * this.points[j].y + this.u * this.points[j + 1].y;
                    this.resultPoints[j].z = (1 - this.u) * this.points[j].z + this.u * this.points[j + 1].z;
                } else {
                    this.resultPoints[j]
                        .x = (1 - this.u) * this.resultPoints[j].x + this.u * this.resultPoints[j + 1].x;
                    this.resultPoints[j]
                        .y = (1 - this.u) * this.resultPoints[j].y + this.u * this.resultPoints[j + 1].y;
                    this.resultPoints[j]
                        .y = (1 - this.u) * this.resultPoints[j].z + this.u * this.resultPoints[j + 1].z;
                }
            }
        }

        this.showResult(this.resultPoints[0]);
    }

    showResult(rPoint: Vector): void {
        let pointForm = document.createElement("div");
        pointForm.className = "form-group has-success";

        let formLabel = document.createElement("h5");
        formLabel.className = "control-label";
        formLabel.innerHTML = "Rezultantna tocka";

        let x = document.createElement("input");
        x.className = "form-control";
        x.disabled = true;
        x.type = "number";
        x.value = rPoint.x;

        let y = document.createElement("input");
        y.className = "form-control";
        y.disabled = true;
        y.type = "number";
        y.value = rPoint.y;

        let z = document.createElement("input");
        z.className = "form-control";
        z.disabled = true;
        z.type = "number";
        z.value = rPoint.z;


        pointForm.appendChild(formLabel);
        pointForm.appendChild(this.breakline);
        pointForm.appendChild(x);
        pointForm.appendChild(this.breakline);
        pointForm.appendChild(y);
        pointForm.appendChild(this.breakline);
        pointForm.appendChild(z);


        $("#taskCom").append(pointForm).append(this.breakline);
        $("#taskBtns").empty();
    }


}



class CanvasUI {
    static width: number;
    static height: number;
    static taskContainer: boolean = false;

    static canvas = document.getElementById("canvas") as HTMLCanvasElement;

    public static refresh(clickedButton: JQuery) {

        this.width = window.innerWidth * 0.70;
        this.height = 800;


        for (let i = 0; i < 9; i++) {
            $(`#task${i + 1}`).removeClass("btn btn-success").addClass("btn btn-primary");
        }

        clickedButton.removeClass("btn btn-primary").addClass("btn btn-success");

        this.clearCanvas();

        if (this.taskContainer === false) {

            let taskContainer = document.getElementById("taskContainer");

            let panel = document.createElement("div");
            panel.className = "panel-heading";

            let heading = document.createElement("h4");
            heading.id = "taskTitle";

            panel.appendChild(heading);

            let descp = document.createElement("div");
            descp.id = "taskDescription";
            descp.className = "panel-body";

            taskContainer.appendChild(panel);
            taskContainer.appendChild(descp);

            this.taskContainer = true;
        } else {
            $("#taskTitle").empty();
            $("#taskDescription").empty();
            $("#taskCom").empty();
            $("#taskBtns").empty();
        }

    }


    

    private static clearCanvas() {
        this.canvas.width = this.canvas.width;
    }


}

class IsMobile {

    public static any() {
        return (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i) || navigator.userAgent.match(/Opera Mini/i) || navigator.userAgent.match(/IEMobile/i));
    }

}


window.onload = () => {


    if (IsMobile.any()) {
        $(".navbar-collapse collapse").remove();
        $("#logo").remove();
        $(".navbar-header").append('<a href="#" class="navbar-brand">Bezierove krivulje</a>');
    }

    $("#task1")
        .click(() => {


            CanvasUI.refresh($("#task1"));


            $("#taskTitle").html(() => "Zadatak 5.");

            $("#taskDescription")
                .html(() =>
                    "Napravite na racunalu program koji ce omoguciti korisniku da oznaci cetiri tocke u ravnini i da se nakon" +
                    "<br/> toga nacrta Bezierova krivulja kojoj su to kontrolne tocke. Isto tako mora biti omoguceno korisniku" +
                    "<br/>da moze micati kontrolne tocke i da se s tim micanjem istovremeno i mijenja Bezierova krivulja. " +
                    "<br/>Kontrolne tocke neka budu redom spojene crtkanim linijama.");

            let a = new QuadriaticBezier(CanvasUI.width, CanvasUI.height, CanvasUI.canvas, 4);

        });

    $("#task2")
        .click(() => {


            CanvasUI.refresh($("#task2"));


            $("#taskTitle").html(() => "Zadatak 6.");
            $("#taskDescription")
                .html(() =>
                    "Implementirajte algoritam na računalu koji će na ulazu imati kontrolne točke Bezierove krivulje q i parametar u e [0,1], a na izlazu će dati q(u). ");


            new DeCasteljau();


        });

    $("#task3")
        .click(() => {
            CanvasUI.refresh($("#task3"));

            $("#taskTitle").html(() => "Zadatak 7.");
            $("#taskDescription")
                .html(() =>
                    "Za krivulje iz zadatka 3 i zadatka 4 izracunajte pomocu Casteljaunovog algoritma q(1/2) i q(3/4).Zadatak napravite rucno i na racunalu pomocu implementiranog algoritma iz prethodnog zadatka."
                );

            $("#taskCom").css("width", 200);

            let label = document.createElement("label");
            label.className = "col-lg-2 control-label";
            label.htmlFor = "select";
            label.innerHTML = "Odaberite podzadatak";

            let select = document.createElement("select");
            select.className = "form-control";
            select.id = "select";

            let o1 = document.createElement("option");
            o1.innerHTML = "zadatak 3. u = 1/2";

            o1.onclick = () => {
                new DeCasteljauPoint(1 / 2);
            };

            let o2 = document.createElement("option");
            o2.innerHTML = "zadatak 3. u = 3/4";

            o2.onclick = () => {
                new DeCasteljauPoint(3 / 4);
            };

            let o3 = document.createElement("option");
            o3.innerHTML = "zadatak 4. u = 1/2";
            o3.onclick = () => {
                new DeCasteljauVector(1 / 2);
            };

            let o4 = document.createElement("option");
            o4.innerHTML = "zadatak 4. u = 3/4";

            o4.onclick = () => {
                new DeCasteljauVector(3 / 4);
            };


            $("#taskCom").append(label).append(select);

            $("#select").append(o1).append(o2).append(o3).append(o4);

        });

    $("#task4")
        .click(() => {
            CanvasUI.refresh($("#task4"));
            $("#taskTitle").html(() => "Zadatak 8.");

            $("#taskDescription")
                .html(() =>
                    "Napišite na računalu algoritam koji će zadanu Bezierovu krivulju podijeliti na dva dijela na mjestu na kojemu korisnik to odluči i da nakon toga se može opet tim dijelovima mijenjati oblik pomoću njihovih kontrolnih točaka.<br/>" +
                    "Uputa: Nakon što nacrtate željeni broj kontrolnih točaka te pritisnite \"Nacrtaj krivulju\" kako biste ju podijelili dva puta kliknite mišom na mjesto gdje biste željeli podijeliti krivulju na 2 dijela"
                );

            let c = new BezierSeparation(CanvasUI.width, CanvasUI.height, CanvasUI.canvas);
        });

    $("#task5")
        .click(() => {

            CanvasUI.refresh($("#task5"));

            $("#taskTitle").html(() => "Zadatak 13.");

            $("#taskDescription")
                .html(() =>
                    "Napravite na racunalu program koji ce omoguciti korisniku da oznaci k tocaka u ravnini za k ∈ {3,4,...,10} i da se nakon toga nacrta Bezierova krivulja stupnja k − 1 kojoj su to kontrolne tocke. " +
                    "Isto tako mora biti omoguceno korisniku da moze micati kontrolne tocke i da se s tim micanjem istovremeno i mijenja Bezierova krivulja. Kontrolne tocke neka budu redom spojene crtkanim linijama."
                );

            let d = new NBezier(CanvasUI.width, CanvasUI.height, CanvasUI.canvas);

        });

    $("#task6")
        .click(() => {
            CanvasUI.refresh($("#task6"));

        });

    $("#task9")
        .click(() => {
            CanvasUI.refresh($("#task9"));

        });

};