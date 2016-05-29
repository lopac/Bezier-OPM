interface IBezier {
    points: Array<Point>;
    drawControlPoint(point: Point): void;
    drawLineBetween(p1: Point, p2: Point): void;

}