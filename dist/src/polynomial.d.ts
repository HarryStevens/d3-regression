import { PredictFunction, Accessor, DataPoint, Domain } from "./types";
export type PolynomialOutput = [DataPoint, DataPoint] & {
    coefficients: number[];
    predict: PredictFunction;
    rSquared: number;
};
export interface PolynomialRegression<T> {
    (data: T[]): PolynomialOutput;
    domain(): Domain;
    domain(domain?: Domain): this;
    x(): Accessor<T>;
    x(x: Accessor<T>): this;
    y(): Accessor<T>;
    y(y: Accessor<T>): this;
    order(): number;
    order(order: number): this;
}
export default function polynomial<T = DataPoint>(): PolynomialRegression<T>;
