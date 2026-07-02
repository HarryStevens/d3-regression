export type RegressionAccessor<T> = (datum: T, index: number, data: T[]) => number;
export type RegressionPoint = [number, number];

export interface RegressionResult extends Array<RegressionPoint> {
  rSquared: number;
  predict(x: number): number;
}

export interface RegressionLinearResult extends RegressionResult {
  a: number;
  b: number;
}

export interface RegressionExponentialResult extends RegressionResult {
  a: number;
  b: number;
}

export interface RegressionLogarithmicResult extends RegressionResult {
  a: number;
  b: number;
}

export interface RegressionPowerResult extends RegressionResult {
  a: number;
  b: number;
}

export interface RegressionLogisticResult extends RegressionResult {
  L: number;
  k: number;
  x0: number;
}

export interface RegressionSigmoidalResult extends RegressionResult {
  A: number;
  B: number;
  C: number;
  M: number;
}

export interface RegressionQuadraticResult extends RegressionResult {
  a: number;
  b: number;
  c: number;
}

export interface RegressionPolynomialResult extends RegressionResult {
  coefficients: number[];
}

export interface RegressionLoessResult extends Array<RegressionPoint> {
  rSquared: number;
  predict(x: number): number;
}

export interface RegressionDomain<T, R> {
  (data: T[]): R;
  domain(): [number, number] | undefined;
  domain(domain: [number, number]): this;
  x(): RegressionAccessor<T>;
  x(accessor: RegressionAccessor<T>): this;
  y(): RegressionAccessor<T>;
  y(accessor: RegressionAccessor<T>): this;
}

export interface RegressionLinear<T> extends RegressionDomain<T, RegressionLinearResult> {}
export interface RegressionExponential<T> extends RegressionDomain<T, RegressionExponentialResult> {}
export interface RegressionPower<T> extends RegressionDomain<T, RegressionPowerResult> {}
export interface RegressionLogistic<T> extends RegressionDomain<T, RegressionLogisticResult> {}
export interface RegressionSigmoidal<T> extends RegressionDomain<T, RegressionSigmoidalResult> {}
export interface RegressionQuadratic<T> extends RegressionDomain<T, RegressionQuadraticResult> {}

export interface RegressionLogarithmic<T> extends RegressionDomain<T, RegressionLogarithmicResult> {
  base(): number;
  base(base: number): this;
}

export interface RegressionPolynomial<T> extends RegressionDomain<T, RegressionPolynomialResult> {
  order(): number;
  order(order: number): this;
}

export interface RegressionLoess<T> {
  (data: T[]): RegressionLoessResult;
  bandwidth(): number;
  bandwidth(bandwidth: number): this;
  x(): RegressionAccessor<T>;
  x(accessor: RegressionAccessor<T>): this;
  y(): RegressionAccessor<T>;
  y(accessor: RegressionAccessor<T>): this;
}

export function regressionExp<T = RegressionPoint>(): RegressionExponential<T>;
export function regressionLinear<T = RegressionPoint>(): RegressionLinear<T>;
export function regressionLoess<T = RegressionPoint>(): RegressionLoess<T>;
export function regressionLog<T = RegressionPoint>(): RegressionLogarithmic<T>;
export function regressionLogistic<T = RegressionPoint>(): RegressionLogistic<T>;
export function regressionPoly<T = RegressionPoint>(): RegressionPolynomial<T>;
export function regressionPow<T = RegressionPoint>(): RegressionPower<T>;
export function regressionQuad<T = RegressionPoint>(): RegressionQuadratic<T>;
export function regressionSigmoidal<T = RegressionPoint>(): RegressionSigmoidal<T>;
