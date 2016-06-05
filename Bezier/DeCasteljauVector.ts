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

    private toFixed(n: number) {
        return parseFloat((n).toFixed(2)).toString();
    }

    addPoint(point: Vector): void {

        this.points.push(point);

        let pointForm = document.createElement("div");
        pointForm.className = "form-group";

        let formLabel = document.createElement("h5");
        formLabel.className = "control-label";
        formLabel.innerHTML = `Točka P${this.pointsCount++}`;

        let x = document.createElement("input");
        x.className = "form-control";


        x.disabled = true;
        x.value = this.toFixed(point.x);

        let y = document.createElement("input");
        y.className = "form-control";


        y.value = this.toFixed(point.y);
        y.disabled = true;

        let z = document.createElement("input");
        z.className = "form-control";
  

        z.value = this.toFixed(point.z);
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

        let apiModel = new DeCasteljauVectorVM(this.u, this.points);

        $.ajax({
            type: "POST",
            data: JSON.stringify(apiModel),
            url: "/api/DeCasteljauVector",
            contentType: "application/json"
        }).done(result => {
            this.showResult(new Vector(result.X, result.Y,result.Z));
        });
        

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