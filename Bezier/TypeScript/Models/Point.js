/// <reference path="../Bezier/Scripts/typings/jquery/jquery.ts" />
var Point = (function () {
    function Point(x, y) {
        if (x === void 0) { x = null; }
        if (y === void 0) { y = null; }
        this.x = x;
        this.y = y;
    }
    return Point;
}());
