import { PredictFunction, Domain, DataPoint, Accessor } from "./types";
/**
 * Sigmoidal (logistic) regression of the form:
 *   f(x) = C + A / (1 + exp(-B * (x - M)))
 * where A, B, C, M are parameters found via gradient descent.
 */
export type SigmoidalOutput = [DataPoint, DataPoint] & {
    A: number;
    B: number;
    C: number;
    M: number;
    predict: PredictFunction;
    rSquared: number;
};
export interface SigmoidalRegression<T> {
    (data: T[]): SigmoidalOutput;
    domain(): Domain;
    domain(domain: Domain): this;
    x(): Accessor<T>;
    x(fn: Accessor<T>): this;
    y(): Accessor<T>;
    y(fn: Accessor<T>): this;
}
export default function sigmoidal<T = DataPoint>(): SigmoidalRegression<T>;
