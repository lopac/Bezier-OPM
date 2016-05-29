var DeCasteljauVector = (function () {
    function DeCasteljauVector(uVal) {
        this.pointsCount = 0;
        this.u = 0;
        this.breakline = document.createElement("br");
        this.points = new Array();
        this.resultPoints = new Array();
        var form = document.createElement("div");
        form.className = "form-group";
        var label = document.createElement("h5");
        label.className = "control-label";
        label.innerHTML = "u";
        var u = document.createElement("input");
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
    DeCasteljauVector.prototype.addPoint = function (point) {
        this.points.push(point);
        var pointForm = document.createElement("div");
        pointForm.className = "form-group";
        var formLabel = document.createElement("h5");
        formLabel.className = "control-label";
        formLabel.innerHTML = "To\uFFFDka P" + this.pointsCount++;
        var x = document.createElement("input");
        x.className = "form-control";
        x.disabled = true;
        x.value = point.x;
        var y = document.createElement("input");
        y.className = "form-control";
        y.value = point.y;
        y.disabled = true;
        var z = document.createElement("input");
        z.className = "form-control";
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
    };
    DeCasteljauVector.prototype.compute = function () {
        var _this = this;
        var apiModel = new DeCasteljauVectorApi(this.u, this.points);
        $.ajax({
            type: "POST",
            data: JSON.stringify(apiModel),
            url: "/api/DeCasteljauVector",
            contentType: "application/json"
        }).done(function (result) {
            _this.showResult(new Vector(result.X, result.Y, result.Z));
        });
    };
    DeCasteljauVector.prototype.showResult = function (rPoint) {
        var pointForm = document.createElement("div");
        pointForm.className = "form-group has-success";
        var formLabel = document.createElement("h5");
        formLabel.className = "control-label";
        formLabel.innerHTML = "Rezultantna tocka";
        var x = document.createElement("input");
        x.className = "form-control";
        x.disabled = true;
        x.type = "number";
        x.value = rPoint.x;
        var y = document.createElement("input");
        y.className = "form-control";
        y.disabled = true;
        y.type = "number";
        y.value = rPoint.y;
        var z = document.createElement("input");
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
    };
    return DeCasteljauVector;
}());
//# sourceMappingURL=DeCasteljauVector.js.map