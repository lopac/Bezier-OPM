var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
