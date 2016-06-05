var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BezierLifting = (function (_super) {
    __extends(BezierLifting, _super);
    function BezierLifting() {
        _super.apply(this, arguments);
        this.drawButton = null;
        this.curveDrawed = false;
        this.curveLifted = false;
    }
    BezierLifting.prototype.computeBezierPoint = function (count, i, u, p) {
        if (count === 0) {
            return p[i];
        }
        var p1 = this.computeBezierPoint(count - 1, i, u, p);
        var p2 = this.computeBezierPoint(count - 1, i + 1, u, p);
        return new Point(((1 - u) * p1.x + u * p2.x), ((1 - u) * p1.y + u * p2.y));
    };
    BezierLifting.prototype.drawBezierCurve = function (points) {
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
    BezierLifting.prototype.createPoint = function (point) {
        var _this = this;
        if (this.points.length < this.pointsCount && this.curveDrawed === false) {
            _super.prototype.createPoint.call(this, point);
        }
        if (this.points.length === this.pointsCount) {
            this.drawBezierCurve();
        }
        if (this.drawButton === null && this.points.length >= this.pointsCount) {
            this.drawButton = document.createElement("a");
            this.drawButton.className = "btn btn-primary";
            this.drawButton.innerHTML = "Podigni krivulju";
            this.drawButton.onclick = function () { return _this.liftCurve(); };
            $("#taskBtns").append(this.drawButton);
        }
    };
    BezierLifting.prototype.renderPoints = function () {
        _super.prototype.renderPoints.call(this);
        if (this.curveDrawed) {
            this.drawBezierCurve();
        }
    };
    BezierLifting.prototype.removePoint = function (selectedPoint) {
    };
    BezierLifting.prototype.liftCurve = function () {
        this.clearCanvas();
        var newPoints = new Array();
        if (this.pointsCount === 3) {
            newPoints.push(this.points[0]);
            var p1x = (1 / 3) * this.points[0].x + ((1 - (1 / 3)) * this.points[1].x);
            var p1y = (1 / 3) * this.points[0].y + ((1 - (1 / 3)) * this.points[1].y);
            newPoints.push(new Point(p1x, p1y));
            var p2x = (2 / 3) * this.points[1].x + ((1 - (2 / 3)) * this.points[2].x);
            var p2y = (2 / 3) * this.points[1].y + ((1 - (1 / 3)) * this.points[2].y);
            newPoints.push(new Point(p2x, p2y));
            newPoints.push(this.points[2]);
        }
        else {
            newPoints.push(this.points[0]);
            var p1X = (1 / 4) * this.points[0].x + ((1 - (1 / 4)) * this.points[1].x);
            var p1Y = (1 / 4) * this.points[0].y + ((1 - (1 / 4)) * this.points[1].y);
            newPoints.push(new Point(p1X, p1Y));
            var p2X = (2 / 4) * this.points[1].x + ((1 - (2 / 4)) * this.points[2].x);
            var p2Y = (2 / 4) * this.points[1].y + ((1 - (1 / 4)) * this.points[2].y);
            newPoints.push(new Point(p2X, p2Y));
            var p3X = (3 / 4) * this.points[2].x + ((1 - (3 / 4)) * this.points[3].x);
            var p3Y = (3 / 4) * this.points[2].y + ((1 - (3 / 4)) * this.points[3].y);
            newPoints.push(new Point(p3X, p3Y));
            newPoints.push(this.points[3]);
        }
        this.points = newPoints;
        for (var i = 1; i < this.points.length; i++) {
            this.drawLineBetween(this.points[i - 1], this.points[i]);
        }
        for (var i = 0; i < this.points.length; i++) {
            this.drawControlPoint(this.points[i]);
        }
        this.drawBezierCurve(newPoints);
        this.curveLifted = true;
        $("#taskBtns").empty();
    };
    return BezierLifting;
}(Bezier));
//# sourceMappingURL=BezierLifting.js.map