import { PredictFunction, DataPoint, Accessor, Domain } from "./types";
type LogarithmicOutput = [DataPoint, DataPoint] & {
    a: number;
    b: number;
    predict: PredictFunction;
    rSquared: number;
};
export interface LogarithmicRegression<T> {
    (data: T[]): LogarithmicOutput;
    domain(): Domain;
    domain(arr: Domain): this;
    x(): Accessor<T>;
    x(fn: Accessor<T>): this;
    y(): Accessor<T>;
    y(fn: Accessor<T>): this;
    base(): number;
    base(b: number): this;
}
export default function logarithmic<T = DataPoint>(): LogarithmicRegression<T>;
export {};
