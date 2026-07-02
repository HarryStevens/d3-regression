import { determination } from "./utils/determination.js";
import { interpose } from "./utils/interpose.js";
import { pointX, pointY, visitPoints } from "./utils/points.js";
import { sigmoid } from "./utils/sigmoid.js";

const starts = [1, -1, 2, -2, .5, -.5].map(B => ({A: 1, B, C: 0, M: 0}))
        .concat([{A: .9, B: 1, C: .05, M: 0}, {A: 1.1, B: 1, C: -.05, M: 0},
          {A: .9, B: -1, C: .05, M: 0}, {A: 1.1, B: -1, C: -.05, M: 0}]);

function predict(A, B, C, M, x){
  return C + A * sigmoid(B * (x - M));
}

export default function() {
  let x = d => d[0],
      y = d => d[1],
      domain;
   
  function sigmoidal(data){
    let n = 0,
        Xmean = 0,
        Y = 0,
        Xmin = domain ? +domain[0] : Infinity,
        Xmax = domain ? +domain[1] : -Infinity,
        Ymin = Infinity,
        Ymax = -Infinity;

    const points = [];

    visitPoints(data, x, y, (dx, dy) => {
      points.push([dx, dy]);
      ++n;
      Xmean += (dx - Xmean) / n;
      Y += (dy - Y) / n;
      if (dy < Ymin) Ymin = dy;
      if (dy > Ymax) Ymax = dy;
      
      if (!domain){
        if (dx < Xmin) Xmin = dx;
        if (dx > Xmax) Xmax = dx;
      }
    });

    const Xscale = Xmax - Xmin || 1,
          Yscale = Ymax - Ymin || 1,
          X = points.map(d => (d[0] - Xmean) / Xscale),
          Yn = points.map(d => (d[1] - Ymin) / Yscale),
          best = fit(X, Yn, n),
          normalized = normalize(best.A, best.B, best.C),
          A = normalized.A * Yscale,
          B = normalized.B / Xscale,
          C = Ymin + normalized.C * Yscale,
          M = Xmean + best.M * Xscale,
          fn = x => predict(A, B, C, M, x),
          out = interpose(Xmin, Xmax, fn);
    
    out.A = A;
    out.B = B;
    out.C = C;
    out.M = M;
    out.predict = fn;
    out.rSquared = determination(points, pointX, pointY, Y, fn);
    
    return out;  
  }

  sigmoidal.domain = function(arr){
    return arguments.length ? (domain = arr, sigmoidal) : domain;
  }  
  
  sigmoidal.x = function(fn){
    return arguments.length ? (x = fn, sigmoidal) : x;
  }

  sigmoidal.y = function(fn){
    return arguments.length ? (y = fn, sigmoidal) : y;
  }
  
  return sigmoidal;
}

function normalize(A, B, C){
  return A < 0 ? {A: -A, B: -B, C: C + A} : {A, B, C};
}

function fit(X, Y, n){
  let best = {mse: Infinity};

  starts.forEach(start => {
    let {A, B, C, M} = start,
        mA = 0,
        mB = 0,
        mC = 0,
        mM = 0,
        vA = 0,
        vB = 0,
        vC = 0,
        vM = 0,
        previous = Infinity,
        unchanged = 0;

    const alpha = .05,
          beta1 = .9,
          beta2 = .999,
          epsilon = 1e-8,
          maxIter = 5000;

    for (let iter = 1; iter <= maxIter; ++iter) {
      let dA = 0,
          dB = 0,
          dC = 0,
          dM = 0,
          sse = 0;

      for (let i = 0; i < n; ++i) {
        const dx = X[i],
              g = sigmoid(B * (dx - M)),
              dy = A * g * (1 - g),
              e = C + A * g - Y[i];

        sse += e * e;
        dA += e * g;
        dB += e * dy * (dx - M);
        dC += e;
        dM -= e * dy * B;
      }

      const mse = sse / n;
      if (mse < best.mse && isFinite(mse)) best = {A, B, C, M, mse};
      if (Math.abs(previous - mse) < 1e-14) {
        if (++unchanged > 120) break;
      } else {
        unchanged = 0;
      }
      previous = mse;

      dA *= 2 / n;
      dB *= 2 / n;
      dC *= 2 / n;
      dM *= 2 / n;
      if (![dA, dB, dC, dM].every(isFinite)) break;

      mA = beta1 * mA + (1 - beta1) * dA;
      mB = beta1 * mB + (1 - beta1) * dB;
      mC = beta1 * mC + (1 - beta1) * dC;
      mM = beta1 * mM + (1 - beta1) * dM;
      vA = beta2 * vA + (1 - beta2) * dA * dA;
      vB = beta2 * vB + (1 - beta2) * dB * dB;
      vC = beta2 * vC + (1 - beta2) * dC * dC;
      vM = beta2 * vM + (1 - beta2) * dM * dM;

      const rate = alpha * Math.sqrt(1 - Math.pow(beta2, iter)) / (1 - Math.pow(beta1, iter));
      A -= rate * mA / (Math.sqrt(vA) + epsilon);
      B -= rate * mB / (Math.sqrt(vB) + epsilon);
      C -= rate * mC / (Math.sqrt(vC) + epsilon);
      M -= rate * mM / (Math.sqrt(vM) + epsilon);
    }
  });

  return best;
}
