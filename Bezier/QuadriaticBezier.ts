class QuadriaticBezier extends Bezier {

    drawControlPoint(point: Point) {
        super.drawControlPoint(point);

        if (this.points.length === 4) {
            this.drawBezierCurve();
        }

    }

    drawBezierCurve() {
        this.context.setLineDash([0, 0]);
        this.context.lineWidth = 2;
        this.context.strokeStyle = "#ae0001";

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