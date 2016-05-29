var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
//# sourceMappingURL=NBezier.js.map