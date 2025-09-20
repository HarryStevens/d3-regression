import { PredictFunction, Accessor, DataPoint, Domain } from "./types";
export type LinearOutput = [DataPoint, DataPoint] & {
    a: number;
    b: number;
    predict: PredictFunction;
    rSquared: number;
};
export interface LinearRegression<T> {
    (data: T[]): LinearOutput;
    domain(): Domain;
    domain(arr: Domain): this;
    x(): Accessor<T>;
    x(fn: Accessor<T>): this;
    y(): Accessor<T>;
    y(fn: Accessor<T>): this;
}
export default function linear<T = DataPoint>(): LinearRegression<T>;
