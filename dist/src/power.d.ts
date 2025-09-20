import { PredictFunction, DataPoint, Accessor, Domain } from "./types";
export type PowerOutput = [DataPoint, DataPoint] & {
    a: number;
    b: number;
    predict: PredictFunction;
    rSquared: number;
};
interface PowerRegression<T> {
    (data: T[]): PowerOutput;
    domain(): Domain;
    domain(domain?: Domain): this;
    x(): Accessor<T>;
    x(x: Accessor<T>): this;
    y(): Accessor<T>;
    y(y: Accessor<T>): this;
}
export default function power<T = DataPoint>(): PowerRegression<T>;
export {};
