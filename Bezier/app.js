/// <reference path="../Bezier/Scripts/typings/jquery/jquery.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Point = (function () {
    function Point(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    return Point;
}());
var Vector = (function () {
    function Vector(x, y, z) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (z === void 0) { z = 0; }
        this.x = x;
        this.y = y;
        this.z = z;
    }
    return Vector;
}());
var Mouse = (function () {
    function Mouse() {
        this.mouseDown = false;
        this.selected = null;
        this.x = 0;
        this.y = 0;
    }
    return Mouse;
}());
var Bezier = (function () {
    function Bezier(width, height, canvas, pointsCount) {
        var _this = this;
        if (pointsCount === void 0) { pointsCount = null; }
        this.points = new Array();
        this.mouse = new Mouse();
        this.canvasBackground = new Image();
        this.canvasBackground.src = "/Images/canvasBg.png";
        this.pointsCount = pointsCount;
        this.initializeCanvas(width, height, canvas);
        this.canvasBackground.onload = function () {
            _this.initializeCanvas(width, height, canvas);
        };
        this.clearCanvas();
        this.canvas.addEventListener("dblclick", function (event) {
            _this.mouse.x = event.offsetX || (event.layerX - canvas.offsetLeft);
            _this.mouse.y = event.offsetY || (event.layerY - canvas.offsetTop);
            var newPoint = new Point(_this.mouse.x, _this.mouse.y);
            if (_this.getSelectedPointIndex() == null) {
                _this.createPoint(newPoint);
            }
            else {
                _this.removePoint(_this.getSelectedPointIndex());
            }
        }, false);
        this.canvas.addEventListener("mousedown", function (event) {
            event.preventDefault();
            _this.mouse.mouseDown = true;
            _this.mouse.x = event.offsetX || (event.layerX - canvas.offsetLeft);
            _this.mouse.y = event.offsetY || (event.layerY - canvas.offsetTop);
            _this.mouse.selected = _this.getSelectedPointIndex();
        }, false);
        this.canvas.addEventListener("mouseup", function (event) {
            _this.mouse.mouseDown = false;
            _this.mouse.selected = null;
        }, false);
        this.canvas.addEventListener("mousemove", function (event) {
            if (_this.mouse.mouseDown && _this.mouse.selected != null) {
                console.log("selected" + _this.mouse.selected);
                _this.mouse.x = event.offsetX || (event.layerX - canvas.offsetLeft);
                _this.mouse.y = event.offsetY || (event.layerY - canvas.offsetTop);
                _this.points[_this.mouse.selected].x = _this.mouse.x;
                _this.points[_this.mouse.selected].y = _this.mouse.y;
                _this.renderPoints();
            }
        }, false);
    }
    Bezier.prototype.drawControlPoint = function (point) {
        this.context.setLineDash([0, 0]);
        this.context.fillStyle = "#35465c";
        this.context.lineWidth = 4;
        this.context.beginPath();
        this.context.arc(point.x, point.y, 5, 0, Math.PI * 2, true);
        this.context.strokeStyle = "#7a97e8";
        this.context.closePath();
        this.context.stroke();
        this.context.fill();
    };
    Bezier.prototype.drawLineBetween = function (p1, p2) {
        if (p1 === void 0) { p1 = null; }
        if (p2 === void 0) { p2 = null; }
        if (p1 === null || p2 === null) {
            var length_1 = this.points.length;
            p1 = this.points[length_1 - 2];
            p2 = this.points[length_1 - 1];
        }
        this.context.setLineDash([5, 15]);
        this.context.lineWidth = 1.5;
        this.context.strokeStyle = "#ec3a34";
        this.context.beginPath();
        this.context.moveTo(p1.x, p1.y);
        this.context.lineTo(p2.x, p2.y);
        this.context.stroke();
    };
    Bezier.prototype.clearCanvas = function () {
        this.initializeCanvas(this.canvas.width, this.canvas.height, this.canvas);
    };
    Bezier.prototype.renderPoints = function () {
        this.clearCanvas();
        for (var i = 0; i < this.points.length; i++) {
            this.drawControlPoint(this.points[i]);
            if (i + 1 < this.points.length) {
                this.drawLineBetween(this.points[i], this.points[i + 1]);
            }
        }
    };
    ;
    Bezier.prototype.createPoint = function (point) {
        this.points.push(point);
        this.renderPoints();
    };
    Bezier.prototype.initializeCanvas = function (width, height, canvas) {
        this.canvas = canvas;
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = canvas.getContext("2d");
        this.context.fillStyle = this.context.createPattern(this.canvasBackground, "repeat");
        this.context.fillRect(0, 0, width, height);
    };
    Bezier.prototype.getSelectedPointIndex = function () {
        var selected = null;
        for (var i = 0; i < this.points.length; i++) {
            var dx = this.points[i].x - this.mouse.x;
            var dy = this.points[i].y - this.mouse.y;
            var distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
            if (distance < 30 && this.mouse.selected === null) {
                selected = i;
            }
        }
        return selected;
    };
    Bezier.prototype.removePoint = function (selectedPoint) {
        this.points.splice(selectedPoint, 1);
        this.renderPoints();
    };
    return Bezier;
}());
var BezierSeparation = (function (_super) {
    __extends(BezierSeparation, _super);
    function BezierSeparation() {
        _super.apply(this, arguments);
        this.drawButton = null;
        this.curveDrawed = false;
        this.curveSeparated = false;
    }
    BezierSeparation.prototype.computeBezierPoint = function (count, i, u, p) {
        if (count === 0) {
            return p[i];
        }
        var p1 = this.computeBezierPoint(count - 1, i, u, p);
        var p2 = this.computeBezierPoint(count - 1, i + 1, u, p);
        return new Point(((1 - u) * p1.x + u * p2.x), ((1 - u) * p1.y + u * p2.y));
    };
    BezierSeparation.prototype.drawBezierCurve = function (points) {
        if (points === void 0) { points = null; }
        this.context.setLineDash([0, 0]);
        this.context.lineWidth = 2;
        this.context.strokeStyle = "#be574e";
        var p = points === null ? this.points : points;
        this.context.moveTo(p[0].x, p[0].y);
        for (var i = 0; i <= 1; i += 0.005) {
            var point = this.computeBezierPoint(p.length - 1, 0, i, p);
            this.context.lineTo(point.x, point.y);
        }
        this.context.stroke();
        if (this.curveDrawed === false) {
            this.curveDrawed = true;
            $("#taskBtns").empty();
        }
    };
    BezierSeparation.prototype.createPoint = function (point) {
        var _this = this;
        if (this.points.length < 15 && this.curveDrawed === false) {
            _super.prototype.createPoint.call(this, point);
        }
        //if (this.curveDrawed) {
        //    super.createPoint(point);
        //    this.seperateCurve(point);
        //}
        if (this.drawButton === null && this.points.length > 2) {
            this.drawButton = document.createElement("a");
            this.drawButton.className = "btn btn-primary";
            this.drawButton.innerHTML = "Nacrtaj krivulju";
            this.drawButton.onclick = function () { return _this.drawBezierCurve(); };
            $("#taskBtns").append(this.drawButton);
        }
    };
    BezierSeparation.prototype.renderPoints = function () {
        if (this.curveSeparated) {
            this.seperateCurve();
        }
        else {
            _super.prototype.renderPoints.call(this);
            if (this.curveDrawed) {
                this.drawBezierCurve();
            }
        }
    };
    BezierSeparation.prototype.removePoint = function (selectedPoint) {
        this.sIndex = selectedPoint;
        this.seperateCurve();
    };
    BezierSeparation.prototype.seperateCurve = function () {
        this.clearCanvas();
        var p1 = new Array();
        var p2 = new Array();
        for (var i = 1; i < this.points.length; i++) {
            this.drawLineBetween(this.points[i - 1], this.points[i]);
        }
        for (var i = 0; i <= this.sIndex; i++) {
            this.drawControlPoint(this.points[i]);
            p1.push(this.points[i]);
        }
        this.drawBezierCurve(p1);
        for (var i = this.sIndex; i < this.points.length; i++) {
            this.drawControlPoint(this.points[i]);
            p2.push(this.points[i]);
        }
        this.drawBezierCurve(p2);
        this.curveSeparated = true;
    };
    return BezierSeparation;
}(Bezier));
var QuadriaticBezier = (function (_super) {
    __extends(QuadriaticBezier, _super);
    function QuadriaticBezier() {
        _super.apply(this, arguments);
    }
    QuadriaticBezier.prototype.drawControlPoint = function (point) {
        _super.prototype.drawControlPoint.call(this, point);
        if (this.points.length === 4) {
            this.drawBezierCurve();
        }
    };
    QuadriaticBezier.prototype.drawBezierCurve = function () {
        this.context.setLineDash([0, 0]);
        this.context.lineWidth = 3;
        this.context.strokeStyle = "#be574e";
        this.context.moveTo(this.points[0].x, this.points[0].y);
        for (var i = 0; i < 1; i += 0.01) {
            var point = this.computeBezierPoint(i);
            this.context.lineTo(point.x, point.y);
        }
        this.context.stroke();
    };
    QuadriaticBezier.prototype.computeBezierPoint = function (t) {
        var cX = 3 * (this.points[1].x - this.points[0].x);
        var bX = 3 * (this.points[2].x - this.points[1].x) - cX;
        var aX = this.points[3].x - this.points[0].x - cX - bX;
        var cY = 3 * (this.points[1].y - this.points[0].y);
        var bY = 3 * (this.points[2].y - this.points[1].y) - cY;
        var aY = this.points[3].y - this.points[0].y - cY - bY;
        var point = new Point();
        point.x = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t) + this.points[0].x;
        point.y = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t) + this.points[0].y;
        return point;
    };
    QuadriaticBezier.prototype.createPoint = function (point) {
        if (this.points.length < this.pointsCount) {
            _super.prototype.createPoint.call(this, point);
        }
    };
    return QuadriaticBezier;
}(Bezier));
var NBezier = (function (_super) {
    __extends(NBezier, _super);
    function NBezier() {
        _super.apply(this, arguments);
        this.drawButton = null;
        this.curveDrawed = false;
    }
    NBezier.prototype.computeBezierPoint = function (count, i, u) {
        if (count === 0) {
            return this.points[i];
        }
        var p1 = this.computeBezierPoint(count - 1, i, u);
        var p2 = this.computeBezierPoint(count - 1, i + 1, u);
        return new Point(((1 - u) * p1.x + u * p2.x), ((1 - u) * p1.y + u * p2.y));
    };
    NBezier.prototype.drawBezierCurve = function () {
        this.context.setLineDash([0, 0]);
        this.context.lineWidth = 2;
        this.context.strokeStyle = "#be574e";
        this.context.moveTo(this.points[0].x, this.points[0].y);
        for (var i = 0; i <= 1; i += 0.005) {
            var point = this.computeBezierPoint(this.points.length - 1, 0, i);
            this.context.lineTo(point.x, point.y);
        }
        console.log("DBC");
        this.context.stroke();
        if (this.curveDrawed === false) {
            this.curveDrawed = true;
            $("#taskBtns").empty();
        }
    };
    NBezier.prototype.createPoint = function (point) {
        var _this = this;
        if (this.points.length < 10) {
            _super.prototype.createPoint.call(this, point);
            console.log("CP");
        }
        if (this.drawButton === null && this.points.length > 2) {
            this.drawButton = document.createElement("a");
            this.drawButton.className = "btn btn-primary";
            this.drawButton.innerHTML = "Nacrtaj krivulju";
            this.drawButton.onclick = function () { return _this.drawBezierCurve(); };
            $("#taskBtns").append(this.drawButton);
            console.log("IF");
        }
    };
    NBezier.prototype.renderPoints = function () {
        _super.prototype.renderPoints.call(this);
        console.log("REBDER");
        if (this.curveDrawed) {
            this.drawBezierCurve();
        }
    };
    return NBezier;
}(Bezier));
// ReSharper disable InconsistentNaming
var DeCasteljauApi = (function () {
    function DeCasteljauApi(u, points) {
        this.U = u;
        this.Points = points;
    }
    return DeCasteljauApi;
}());
// ReSharper restore InconsistentNaming
var DeCasteljau = (function () {
    function DeCasteljau() {
        var _this = this;
        this.pointsCount = 0;
        this.u = 0;
        this.breakline = document.createElement("br");
        this.points = new Array();
        this.resultPoints = new Array();
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
        this.addPointBtn.innerHTML = "Dodaj točku";
        this.addPointBtn.onclick = function () { return _this.addPoint(); };
        this.computeBtn = document.createElement("a");
        this.computeBtn.className = "btn btn-success";
        this.computeBtn.id = "computeBtn";
        this.computeBtn.innerHTML = "Izracunaj";
        this.computeBtn.onclick = function () {
            var point = new Point();
            point.x = Number($("#p" + _this.pointsCount + "x").val());
            point.y = Number($("#p" + _this.pointsCount + "y").val());
            _this.points.push(point);
            var c = _this.compute();
            console.log(JSON.stringify(c));
        };
        $("#taskBtns").append(this.addPointBtn);
    }
    DeCasteljau.prototype.showResult = function (rPoint) {
        console.log(rPoint);
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
            url: "../api/DeCasteljau",
            contentType: "application/json"
        }).done(function (result) {
            _this.showResult(new Point(result.X, result.Y));
        });
    };
    DeCasteljau.prototype.addPoint = function (nPoint) {
        if (nPoint === void 0) { nPoint = null; }
        if (this.pointsCount !== 0) {
            if (nPoint === null) {
                var point = new Point();
                point.x = Number($("#p" + this.pointsCount + "x").val());
                point.y = Number($("#p" + this.pointsCount + "y").val());
                this.points.push(point);
            }
        }
        else {
            if (nPoint === null) {
                this.u = Number($("#u").val());
                if (this.u > 1) {
                    alert("Parametar u ne smije biti veći od 1!");
                }
            }
        }
        var pointForm = document.createElement("div");
        pointForm.className = "form-group";
        var formLabel = document.createElement("h5");
        formLabel.className = "control-label";
        formLabel.innerHTML = "To\u010Dka P" + ++this.pointsCount;
        var inputX = document.createElement("input");
        inputX.className = "form-control";
        inputX.id = "p" + this.pointsCount + "x";
        inputX.type = "number";
        inputX.placeholder = "Unesite x..";
        inputX.value = nPoint !== null ? nPoint.x : (Math.floor(Math.random() * 100) + 1).toString();
        inputX.disabled = nPoint !== null;
        var inputY = document.createElement("input");
        inputY.className = "form-control";
        inputY.id = "p" + this.pointsCount + "y";
        inputY.type = "number";
        inputY.value = nPoint !== null ? nPoint.y : (Math.floor(Math.random() * 100) + 1).toString();
        inputY.placeholder = "Unesite y..";
        inputY.disabled = nPoint !== null;
        pointForm.appendChild(formLabel);
        pointForm.appendChild(this.breakline);
        pointForm.appendChild(inputX);
        pointForm.appendChild(this.breakline);
        pointForm.appendChild(inputY);
        $("#taskCom").append(pointForm).append(this.breakline);
        if (nPoint === null) {
            this.addPointBtn.remove();
            this.computeBtn.remove();
            $("#taskBtns").append(this.addPointBtn).append(this.computeBtn);
        }
        else {
            this.points.push(nPoint);
        }
    };
    return DeCasteljau;
}());
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
        formLabel.innerHTML = "To\u010Dka P" + ++this.pointsCount;
        var x = document.createElement("input");
        x.className = "form-control";
        x.id = "p" + this.pointsCount + "x";
        x.type = "number";
        x.disabled = true;
        x.value = point.x;
        var y = document.createElement("input");
        y.className = "form-control";
        y.id = "p" + this.pointsCount + "y";
        y.type = "number";
        y.value = point.y;
        y.disabled = true;
        var z = document.createElement("input");
        z.className = "form-control";
        z.id = "p" + this.pointsCount + "z";
        z.type = "number";
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
        for (var i = this.points.length - 1; i > 0; i--) {
            for (var j = 0; j < i; j++) {
                this.resultPoints[j] = new Vector();
                if (i === this.points.length - 1) {
                    this.resultPoints[j].x = (1 - this.u) * this.points[j].x + this.u * this.points[j + 1].x;
                    this.resultPoints[j].y = (1 - this.u) * this.points[j].y + this.u * this.points[j + 1].y;
                    this.resultPoints[j].z = (1 - this.u) * this.points[j].z + this.u * this.points[j + 1].z;
                }
                else {
                    this.resultPoints[j]
                        .x = (1 - this.u) * this.resultPoints[j].x + this.u * this.resultPoints[j + 1].x;
                    this.resultPoints[j]
                        .y = (1 - this.u) * this.resultPoints[j].y + this.u * this.resultPoints[j + 1].y;
                    this.resultPoints[j]
                        .y = (1 - this.u) * this.resultPoints[j].z + this.u * this.resultPoints[j + 1].z;
                }
            }
        }
        this.showResult(this.resultPoints[0]);
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
var CanvasUI = (function () {
    function CanvasUI() {
    }
    CanvasUI.refresh = function (clickedButton) {
        this.width = window.innerWidth * 0.70;
        this.height = 800;
        for (var i = 0; i < 9; i++) {
            $("#task" + (i + 1)).removeClass("btn btn-success").addClass("btn btn-primary");
        }
        clickedButton.removeClass("btn btn-primary").addClass("btn btn-success");
        this.clearCanvas();
        if (this.taskContainer === false) {
            var taskContainer = document.getElementById("taskContainer");
            var panel = document.createElement("div");
            panel.className = "panel-heading";
            var heading = document.createElement("h4");
            heading.id = "taskTitle";
            panel.appendChild(heading);
            var descp = document.createElement("div");
            descp.id = "taskDescription";
            descp.className = "panel-body";
            taskContainer.appendChild(panel);
            taskContainer.appendChild(descp);
            this.taskContainer = true;
        }
        else {
            $("#taskTitle").empty();
            $("#taskDescription").empty();
            $("#taskCom").empty();
            $("#taskBtns").empty();
        }
    };
    CanvasUI.clearCanvas = function () {
        this.canvas.width = this.canvas.width;
    };
    CanvasUI.taskContainer = false;
    CanvasUI.canvas = document.getElementById("canvas");
    return CanvasUI;
}());
window.onload = function () {
    $("#task1")
        .click(function () {
        CanvasUI.refresh($("#task1"));
        $("#taskTitle").html(function () { return "Zadatak 5."; });
        $("#taskDescription")
            .html(function () {
            return "Napravite na racunalu program koji ce omoguciti korisniku da oznaci cetiri tocke u ravnini i da se nakon" +
                "<br/> toga nacrta Bezierova krivulja kojoj su to kontrolne tocke. Isto tako mora biti omoguceno korisniku" +
                "<br/>da moze micati kontrolne tocke i da se s tim micanjem istovremeno i mijenja Bezierova krivulja. " +
                "<br/>Kontrolne tocke neka budu redom spojene crtkanim linijama.";
        });
        var a = new QuadriaticBezier(CanvasUI.width, CanvasUI.height, CanvasUI.canvas, 4);
    });
    $("#task2")
        .click(function () {
        CanvasUI.refresh($("#task2"));
        $("#taskTitle").html(function () { return "Zadatak 6."; });
        $("#taskDescription")
            .html(function () {
            return "Implementirajte algoritam na računalu koji će na ulazu imati kontrolne točke Bezierove krivulje q i parametar u e [0,1], a na izlazu će dati q(u). ";
        });
        var deCasteljau = new DeCasteljau();
    });
    $("#task3")
        .click(function () {
        CanvasUI.refresh($("#task3"));
        $("#taskTitle").html(function () { return "Zadatak 7."; });
        $("#taskDescription")
            .html(function () {
            return "Za krivulje iz zadatka 3 i zadatka 4 izracunajte pomocu Casteljaunovog algoritma q(1/2) i q(3/4).Zadatak napravite rucno i na racunalu pomocu implementiranog algoritma iz prethodnog zadatka.";
        });
        $("#taskCom").css("width", 200);
        var label = document.createElement("label");
        label.className = "col-lg-2 control-label";
        label.htmlFor = "select";
        label.innerHTML = "Odaberite podzadatak";
        var select = document.createElement("select");
        select.className = "form-control";
        select.id = "select";
        var o1 = document.createElement("option");
        o1.innerHTML = "zadatak 3. u = 1/2";
        //o1.onclick = () => {
        //    let dc = new DeCasteljau(1 / 2);
        //};
        //let o2 = document.createElement("option");
        //o2.innerHTML = "zadatak 3. u = 3/4";
        //o2.onclick = () => {
        //    let dc = new DeCasteljau(3 / 4);
        //};
        //let o3 = document.createElement("option");
        //o3.innerHTML = "zadatak 4. u = 1/2";
        //o3.onclick = () => {
        //    let dc = new DeCasteljauVector(1 / 2);
        //};
        //let o4 = document.createElement("option");
        //o4.innerHTML = "zadatak 4. u = 3/4";
        //o4.onclick = () => {
        //    let dcV = new DeCasteljauVector(3 / 4);
        //};
        $("#taskCom").append(label).append(select);
        //$("#select").append(o1).append(o2).append(o3).append(o4);
    });
    $("#task4")
        .click(function () {
        CanvasUI.refresh($("#task4"));
        $("#taskTitle").html(function () { return "Zadatak 8."; });
        $("#taskDescription")
            .html(function () {
            return "Napišite na računalu algoritam koji će zadanu Bezierovu krivulju podijeliti na dva dijela na mjestu na kojemu korisnik to odluči i da nakon toga se može opet tim dijelovima mijenjati oblik pomoću njihovih kontrolnih točaka.<br/>" +
                "Uputa: Nakon što nacrtate željeni broj kontrolnih točaka te pritisnite \"Nacrtaj krivulju\" kako biste ju podijelili dva puta kliknite mišom na mjesto gdje biste željeli podijeliti krivulju na 2 dijela";
        });
        var c = new BezierSeparation(CanvasUI.width, CanvasUI.height, CanvasUI.canvas);
    });
    $("#task5")
        .click(function () {
        CanvasUI.refresh($("#task5"));
        $("#taskTitle").html(function () { return "Zadatak 13."; });
        $("#taskDescription")
            .html(function () {
            return "Napravite na racunalu program koji ce omoguciti korisniku da oznaci k tocaka u ravnini za k ∈ {3,4,...,10} i da se nakon toga nacrta Bezierova krivulja stupnja k − 1 kojoj su to kontrolne tocke. " +
                "Isto tako mora biti omoguceno korisniku da moze micati kontrolne tocke i da se s tim micanjem istovremeno i mijenja Bezierova krivulja. Kontrolne tocke neka budu redom spojene crtkanim linijama.";
        });
        var d = new NBezier(CanvasUI.width, CanvasUI.height, CanvasUI.canvas);
    });
    $("#task6")
        .click(function () {
        CanvasUI.refresh($("#task6"));
    });
    $("#task9")
        .click(function () {
        CanvasUI.refresh($("#task9"));
    });
};
