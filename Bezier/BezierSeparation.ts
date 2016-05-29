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