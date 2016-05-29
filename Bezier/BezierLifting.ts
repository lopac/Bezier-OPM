class BezierLifting extends Bezier {


    drawButton: HTMLAnchorElement = null;
    curveDrawed = false;
    curveLifted = false;


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

        if (this.points.length < this.pointsCount && this.curveDrawed === false) {
            super.createPoint(point);
        }
        if (this.points.length === this.pointsCount) {
            this.drawBezierCurve();
        }


        if (this.drawButton === null && this.points.length >= this.pointsCount) {
            this.drawButton = document.createElement("a");
            this.drawButton.className = "btn btn-primary";
            this.drawButton.innerHTML = "Podigni krivulju";

            this.drawButton.onclick = () => this.liftCurve();

            $("#taskBtns").append(this.drawButton);

        }


    }

    renderPoints(): void {
        super.renderPoints();
        if (this.curveDrawed) {
            this.drawBezierCurve();
        }
    }

    removePoint(selectedPoint: number) {
 
    }

  
    liftCurve() {

        this.clearCanvas();

        let newPoints = new Array<Point>();


        if(this.pointsCount === 3){
            newPoints.push(this.points[0]);

            let p1x = (1 / 3) * this.points[0].x  + ((1 - (1 / 3)) * this.points[1].x);
            let p1y = (1 / 3) * this.points[0].y + ((1 - (1 / 3)) * this.points[1].y);

            newPoints.push(new Point(p1x, p1y));


            let p2x = (2 / 3) * this.points[1].x + ((1 - (2 / 3)) * this.points[2].x);
            let p2y = (2 / 3) * this.points[1].y + ((1 - (1 / 3)) * this.points[2].y);

            newPoints.push(new Point(p2x, p2y));

            newPoints.push(this.points[2]);


        }else {
            newPoints.push(this.points[0]);

            let p1X = (1 / 4) * this.points[0].x + ((1 - (1 / 4)) * this.points[1].x);
            let p1Y = (1 / 4) * this.points[0].y + ((1 - (1 / 4)) * this.points[1].y);

            newPoints.push(new Point(p1X, p1Y));


            let p2X = (2 / 4) * this.points[1].x + ((1 - (2 / 4)) * this.points[2].x);
            let p2Y = (2 / 4) * this.points[1].y + ((1 - (1 / 4)) * this.points[2].y);

            newPoints.push(new Point(p2X, p2Y));


            let p3X = (3 / 4) * this.points[2].x + ((1 - (3 / 4)) * this.points[3].x);
            let p3Y = (3 / 4) * this.points[2].y + ((1 - (3 / 4)) * this.points[3].y);

            newPoints.push(new Point(p3X, p3Y));

            newPoints.push(this.points[3]);
        }


        this.points = newPoints;

        for (let i = 1; i < this.points.length; i++) {
            this.drawLineBetween(this.points[i - 1], this.points[i]);
        }

   
        for (let i = 0; i < this.points.length; i++) {
            this.drawControlPoint(this.points[i]);
         }

        this.drawBezierCurve(newPoints);

        this.curveLifted = true;
        $("#taskBtns").empty();
    }

}