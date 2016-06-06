var Bezier = (function () {
    function Bezier(canvas, pointsCount) {
        var _this = this;
        if (pointsCount === void 0) { pointsCount = null; }
        this.points = new Array();
        this.mouse = new Mouse();
        this.canvasBackground = new Image();
        this.canvasBackground.src = "/Images/greyzz.png";
        this.pointsCount = pointsCount;
        this.initializeCanvas(canvas);
        this.canvasBackground.onload = function () {
            _this.initializeCanvas(canvas);
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
        this.context.fillStyle = "#ae0001";
        this.context.lineWidth = 4;
        this.context.beginPath();
        this.context.arc(point.x, point.y, 5, 0, Math.PI * 2, true);
        this.context.strokeStyle = "#d64d4d";
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
        this.context.lineWidth = 1.2;
        this.context.strokeStyle = "#048364";
        this.context.beginPath();
        this.context.moveTo(p1.x, p1.y);
        this.context.lineTo(p2.x, p2.y);
        this.context.stroke();
    };
    Bezier.prototype.clearCanvas = function () {
        this.initializeCanvas(this.canvas);
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
    Bezier.prototype.initializeCanvas = function (canvas) {
        this.canvas = canvas;
        this.canvas.width = $("#canvas").width();
        this.canvas.height = 800;
        this.context = canvas.getContext("2d");
        this.context.fillStyle = this.context.createPattern(this.canvasBackground, "repeat");
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
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
