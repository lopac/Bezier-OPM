var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
        this.context.lineWidth = 2;
        this.context.strokeStyle = "#ae0001";
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
