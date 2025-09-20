import { Accessor, DataPoint, PredictFunction, Domain } from "./types";
export type QuadraticOutput = [DataPoint, DataPoint] & {
    a: number;
    b: number;
    c: number;
    predict: PredictFunction;
    rSquared: number;
};
interface QuadraticRegression<T> {
    (data: T[]): QuadraticOutput;
    domain(): Domain;
    domain(domain?: Domain): this;
    x(): Accessor<T>;
    x(x: Accessor<T>): this;
    y(): Accessor<T>;
    y(y: Accessor<T>): this;
}
export default function quadratic<T = DataPoint>(): QuadraticRegression<T>;
export {};
