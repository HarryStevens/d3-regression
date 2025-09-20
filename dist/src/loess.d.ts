import { Accessor, DataPoint } from "./types";
export interface LoessRegression<T> {
    (data: T[]): DataPoint[];
    bandwidth(): number;
    bandwidth(bw: number): this;
    x(): Accessor<T>;
    x(fn: Accessor<T>): this;
    y(): Accessor<T>;
    y(fn: Accessor<T>): this;
}
export default function loess<T = DataPoint>(): LoessRegression<T>;
