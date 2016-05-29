interface IDeCasteljau<T> {

    points: Array<T>;
    addPointBtn: HTMLAnchorElement;
    computeBtn: HTMLAnchorElement;
    pointsCount;
    u: number;
    breakline;

    showResult(rPoint: T): void;
    compute(): void;

}