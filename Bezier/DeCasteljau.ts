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
        this.computeBtn.innerHTML = "Izračunaj";

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
        formLabel.innerHTML = "Rezultantna točka";

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
                return;
            }

            $("#taskBtns").append(this.breakline).append(this.computeBtn);
        }


        let pointForm = document.createElement("div");
        pointForm.className = "form-group";

        let formLabel = document.createElement("h5");
        formLabel.className = "control-label";
        formLabel.innerHTML = `Točka P${this.pointsCount++}`;

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