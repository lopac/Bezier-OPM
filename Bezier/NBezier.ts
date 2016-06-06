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
        this.context.strokeStyle = "#ae0001";

        this.context.moveTo(this.points[0].x, this.points[0].y);

        for (let i = 0; i <= 1; i += 0.005) {
            let point = this.computeBezierPoint(this.points.length - 1, 0, i);
            this.context.lineTo(point.x, point.y);
        }
     
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
            this.drawButton.className = "col-lg-12 btn btn-danger";
            this.drawButton.innerHTML = "Nacrtaj krivulju";

            this.drawButton.onclick = () => this.drawBezierCurve();

            $("#taskBtns").append(this.drawButton).append(() => "<div class='col-lg-12' style='height: 30px;' ></div>");
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