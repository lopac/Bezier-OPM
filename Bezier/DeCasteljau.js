var DeCasteljau = (function () {
    function DeCasteljau() {
        var _this = this;
        this.pointsCount = 0;
        this.u = 0;
        this.breakline = document.createElement("br");
        this.points = new Array();
        var form = document.createElement("div");
        form.className = "form-group";
        var label = document.createElement("h5");
        label.className = "control-label";
        label.innerHTML = "Unesite u";
        var input = document.createElement("input");
        input.className = "form-control";
        input.id = "u";
        input.type = "number";
        input.value = "Unesite u..";
        form.appendChild(label);
        form.appendChild(input);
        $("#taskCom").css("width", 200).append(form).append(this.breakline);
        this.addPointBtn = document.createElement("a");
        this.addPointBtn.className = "btn btn-primary";
        this.addPointBtn.innerHTML = "Dodaj to�ku";
        this.addPointBtn.onclick = function () { return _this.addPoint(); };
        this.computeBtn = document.createElement("a");
        this.computeBtn.className = "btn btn-success";
        this.computeBtn.id = "computeBtn";
        this.computeBtn.innerHTML = "Izra�unaj";
        this.computeBtn.onclick = function () {
            var point = new Point();
            point.x = Number($("#p" + _this.pointsCount + "x").val());
            point.y = Number($("#p" + _this.pointsCount + "y").val());
            _this.points.push(point);
            _this.compute();
        };
        $("#taskBtns").append(this.addPointBtn);
    }
    DeCasteljau.prototype.toFixed = function (n) {
        return parseFloat((n).toFixed(2)).toString();
    };
    DeCasteljau.prototype.showResult = function (rPoint) {
        var pointForm = document.createElement("div");
        pointForm.className = "form-group has-success";
        var formLabel = document.createElement("h5");
        formLabel.className = "control-label";
        formLabel.innerHTML = "Rezultantna to�ka";
        var x = document.createElement("input");
        x.className = "form-control";
        x.disabled = true;
        x.type = "number";
        x.value = this.toFixed(rPoint.x);
        var y = document.createElement("input");
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
    };
    DeCasteljau.prototype.compute = function () {
        var _this = this;
        var apiModel = new DeCasteljauApi(this.u, this.points);
        $.ajax({
            type: "POST",
            data: JSON.stringify(apiModel),
            url: "/api/DeCasteljau",
            contentType: "application/json"
        }).done(function (result) {
            _this.showResult(new Point(result.X, result.Y));
        });
    };
    DeCasteljau.prototype.addPoint = function () {
        if (this.pointsCount !== 0) {
            var point = new Point();
            point.x = Number($("#p" + this.pointsCount + "x").val());
            point.y = Number($("#p" + this.pointsCount + "y").val());
            this.points.push(point);
        }
        else {
            this.u = Number($("#u").val());
            if (this.u > 1) {
                alert("Parametar u ne smije biti ve�i od 1!");
                return;
            }
            $("#taskBtns").append(this.breakline).append(this.computeBtn);
        }
        var pointForm = document.createElement("div");
        pointForm.className = "form-group";
        var formLabel = document.createElement("h5");
        formLabel.className = "control-label";
        formLabel.innerHTML = "To\uFFFDka P" + this.pointsCount++;
        var inputX = document.createElement("input");
        inputX.className = "form-control";
        inputX.id = "p" + this.pointsCount + "x";
        inputX.type = "number";
        inputX.placeholder = "Unesite x..";
        inputX.value = (Math.floor(Math.random() * 100) + 1).toString();
        var inputY = document.createElement("input");
        inputY.className = "form-control";
        inputY.id = "p" + this.pointsCount + "y";
        inputY.type = "number";
        inputY.value = (Math.floor(Math.random() * 100) + 1).toString();
        inputY.placeholder = "Unesite y..";
        pointForm.appendChild(formLabel);
        pointForm.appendChild(this.breakline);
        pointForm.appendChild(inputX);
        pointForm.appendChild(this.breakline);
        pointForm.appendChild(inputY);
        $("#taskCom").append(pointForm).append(this.breakline);
    };
    return DeCasteljau;
}());
//# sourceMappingURL=DeCasteljau.js.map