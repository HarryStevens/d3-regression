import { Accessor } from "../types";
/**
 * Adapted from vega-statistics by Jeffrey Heer
 * License: https://github.com/vega/vega/blob/f058b099decad9db78301405dd0d2e9d8ba3d51a/LICENSE
 * Source: https://github.com/vega/vega/blob/f058b099decad9db78301405dd0d2e9d8ba3d51a/packages/vega-statistics/src/regression/points.js
 */
export declare function points<T>(data: T[], x: Accessor<T>, y: Accessor<T>, sort?: boolean): [Float64Array, Float64Array, number, number];
/**
 * Iterates over valid data points, invoking a callback for each.
 */
export declare function visitPoints<T>(data: T[], x: Accessor<T>, y: Accessor<T>, cb: (dx: number, dy: number, index: number) => void): void;
