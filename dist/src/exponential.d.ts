import { PredictFunction, Domain, DataPoint, Accessor } from "./types";
export type ExponentialOutput = [DataPoint, DataPoint] & {
    a: number;
    b: number;
    predict: PredictFunction;
    rSquared: number;
};
export interface ExponentialRegression<T> {
    (data: T[]): ExponentialOutput;
    domain(): Domain;
    domain(arr: Domain): this;
    x(): Accessor<T>;
    x(fn: Accessor<T>): this;
    y(): Accessor<T>;
    y(fn: Accessor<T>): this;
}
export default function exponential<T = DataPoint>(): ExponentialRegression<T>;
