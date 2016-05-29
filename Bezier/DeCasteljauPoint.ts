class DeCasteljauPoint implements IDeCasteljau<Point> {

    points: Array<Point>;
    addPointBtn: HTMLAnchorElement;
    computeBtn: HTMLAnchorElement;
    pointsCount = 0;
    u: number;
    breakline = document.createElement("br");


    private toFixed(n: number) {
        return parseFloat((n).toFixed(2)).toString();
    }


    constructor(u: number) {
        this.u = u;
        this.points = new Array<Point>();

        if (this.u === 0.2) {

            this.addPoint(new Point(1, 1));
            this.addPoint(new Point(1.75, 3));
            this.addPoint(new Point(3, 1));
            this.addPoint(new Point(4, 5/2));
            this.addPoint(new Point(2, 3.2));
            this.addPoint(new Point(3, 4.7));
            this.addPoint(new Point(4, 5.1));

        } else {
            this.addPoint(new Point(0, 1));
            this.addPoint(new Point(1, 2));
            this.addPoint(new Point(4, 0));
            this.addPoint(new Point(3, 0));
        }
        this.compute();
    }

    addPoint(p: Point): void {

        this.points.push(p);

        let pointForm = document.createElement("div");
        pointForm.className = "form-group";
        pointForm.id = "pointForm";

        let formLabel = document.createElement("h5");
        formLabel.className = "control-label";
        formLabel.innerHTML = `Toèka P${this.pointsCount++}`;

      

        let inputX = document.createElement("input");
        inputX.className = "form-control";
        inputX.value = p.x;
        inputX.disabled = true;


        let inputY = document.createElement("input");
        inputY.className = "form-control";
        inputY.value = p.y;
        inputY.disabled = true;


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