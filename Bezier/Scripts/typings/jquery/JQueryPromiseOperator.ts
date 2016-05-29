interface JQueryPromiseOperator<T, U> {
    (callback1: JQueryPromiseCallback<T> | JQueryPromiseCallback<T>[], ...callbacksN: Array<JQueryPromiseCallback<any> | JQueryPromiseCallback<any>[]>): JQueryPromise<U>;
}