class DeCasteljauVectorApi {
    U: number;
    Vectors: Array<Point>;

    constructor(u: number, points: Array<Vector>) {
        this.U = u;
        this.Vectors = points;

    }
}