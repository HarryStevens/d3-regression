import { PredictFunction, DataPoint } from "../types";
/**
 * Given a start point (xmin), an end point (xmax),
 * and a prediction function, returns a smooth line.
 */
export declare function interpose(xmin: number, xmax: number, predict: PredictFunction): [DataPoint, DataPoint];
