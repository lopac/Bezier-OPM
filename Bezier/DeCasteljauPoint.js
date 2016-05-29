var DeCasteljauPoint = (function () {
    function DeCasteljauPoint(u) {
        this.pointsCount = 0;
        this.breakline = document.createElement("br");
        this.u = u;
        this.points = new Array();
        var form = document.createElement("div");
        form.className = "form-group";
        var label = document.createElement("h5");
        label.className = "control-label";
        label.innerHTML = "U";
        var input = document.createElement("input");
        input.className = "form-control";
        input.id = "u";
        input.disabled = true;
        input.type = "number";
        input.value = this.u.toString();
        form.appendChild(label);
        form.appendChild(input);
        $("#taskCom").css("width", 200).append(form).append(this.breakline);
        if (this.u === 0.2) {
            this.addPoint(new Point(1, 1));
            this.addPoint(new Point(1.75, 3));
            this.addPoint(new Point(3, 1));
            this.addPoint(new Point(4, 5 / 2));
            this.addPoint(new Point(2, 3.2));
            this.addPoint(new Point(3, 4.7));
            this.addPoint(new Point(4, 5.1));
        }
        else {
            this.addPoint(new Point(0, 1));
            this.addPoint(new Point(1, 2));
            this.addPoint(new Point(4, 0));
            this.addPoint(new Point(3, 0));
        }
        this.compute();
    }
    DeCasteljauPoint.prototype.toFixed = function (n) {
        return parseFloat((n).toFixed(2)).toString();
    };
    DeCasteljauPoint.prototype.addPoint = function (p) {
        this.points.push(p);
        var pointForm = document.createElement("div");
        pointForm.className = "form-group";
        pointForm.id = "pointForm";
        var formLabel = document.createElement("h5");
        formLabel.className = "control-label";
        formLabel.innerHTML = "To\u010Dka P" + this.pointsCount++;
        var inputX = document.createElement("input");
        inputX.className = "form-control";
        inputX.value = p.x;
        inputX.disabled = true;
        var inputY = document.createElement("input");
        inputY.className = "form-control";
        inputY.value = p.y;
        inputY.disabled = true;
        pointForm.appendChild(formLabel);
        pointForm.appendChild(this.breakline);
        pointForm.appendChild(inputX);
        pointForm.appendChild(this.breakline);
        pointForm.appendChild(inputY);
        $("#taskCom").append(pointForm).append(this.breakline);
    };
    DeCasteljauPoint.prototype.showResult = function (rPoint) {
        var pointForm = document.createElement("div");
        pointForm.className = "form-group has-success";
        var formLabel = document.createElement("h5");
        formLabel.className = "control-label";
        formLabel.innerHTML = "Rezultantna tocka";
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
    DeCasteljauPoint.prototype.compute = function () {
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
    return DeCasteljauPoint;
}());
