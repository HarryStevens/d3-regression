import {median} from "./math/median";

// Adapted from science.js by Jason Davies
// Source: https://github.com/jasondavies/science.js/blob/master/src/stats/loess.js
// License: https://github.com/jasondavies/science.js/blob/master/LICENSE
export default function() {
  let x = d => d[0],
      y = d => d[1],
      bandwidth = .3,
      robustnessIters = 2,
      accuracy = 1e-12;

  function loess(data) {
    const n = data.length;
    let xval = [],
        yval = [],
        weights = [];
    
    for (let i = 0; i < n; i++){
      weights[i] = 1;

      const d = data[i];
      xval[i] = x(d);
      yval[i] = y(d);
    }

    finiteReal(xval);
    finiteReal(yval);
    finiteReal(weights);
    strictlyIncreasing(xval);

    const bandwidthInPoints = Math.floor(bandwidth * n);

    if (bandwidthInPoints < 2) throw {error: "Bandwidth too small."};

    let res = [],
        residuals = [],
        robustnessWeights = [];

    for (let i = 0; i < n; i++){
      res[i] = 0;
      residuals[i] = 0;
      robustnessWeights[i] = 1;
    }

    let iter = -1;
    while (++iter <= robustnessIters) {
      const bandwidthInterval = [0, bandwidthInPoints - 1];
      let dx;

      for (let i = 0; i < n; i++){
        dx = xval[i];

        if (i > 0) {
          updateBandwidthInterval(xval, weights, i, bandwidthInterval);
        }

        const ileft = bandwidthInterval[0],
            iright = bandwidthInterval[1];

        const edge = (xval[i] - xval[ileft]) > (xval[iright] - xval[i]) ? ileft : iright;
  
        let sumWeights = 0,
            sumX = 0,
            sumXSquared = 0,
            sumY = 0,
            sumXY = 0,
            denom = Math.abs(1 / (xval[edge] - dx));

        for (let k = ileft; k <= iright; ++k) {
          const xk = xval[k],
              yk = yval[k],
              dist = k < i ? dx - xk : xk - dx,
              w = tricube(dist * denom) * robustnessWeights[k] * weights[k],
              xkw = xk * w;
          
          sumWeights += w;
          sumX += xkw;
          sumXSquared += xk * xkw;
          sumY += yk * w;
          sumXY += yk * xkw;
        }

        const meanX = sumX / sumWeights,
            meanY = sumY / sumWeights,
            meanXY = sumXY / sumWeights,
            meanXSquared = sumXSquared / sumWeights,
            beta = (Math.sqrt(Math.abs(meanXSquared - meanX * meanX)) < accuracy) ? 0 : ((meanXY - meanX * meanY) / (meanXSquared - meanX * meanX)),
            alpha = meanY - beta * meanX;

        res[i] = beta * dx + alpha;
        residuals[i] = Math.abs(yval[i] - res[i]);
      }

      if (iter === robustnessIters) {
        break;
      }

      const medianResidual = median(residuals);

      if (Math.abs(medianResidual) < accuracy){ break; }

      let arg,
          w;

      for (let i = 0; i < n; i++){
        arg = residuals[i] / (6 * medianResidual);
        robustnessWeights[i] = (arg >= 1) ? 0 : ((w = 1 - arg * arg) * w);
      }
      
    }

    return res.map((d, i) => [xval[i], d]);
  }

  loess.bandwidth = function(n) {
    return arguments.length ? (bandwidth = n, loess) : bandwidth;
  };

  loess.x = function(fn){
    return arguments.length ? (x = fn, loess) : x;
  }

  loess.y = function(fn){
    return arguments.length ? (y = fn, loess) : y;
  }

  return loess;
}

function finiteReal(values) {
  for (let i = 0, n = values.length; i < n; i++){
    if (!isFinite(values[i])) return false;
  }

  return true;
}

function strictlyIncreasing(xval) {
  for (let i = 0, n = xval.length; i < n; i++){
    if (xval[i - 1] >= xval[i]) return false;
  }

  return true;
}

function tricube(x) {
  return (x = 1 - x * x * x) * x * x;
}

function updateBandwidthInterval(xval, weights, i, bandwidthInterval) {
  let left = bandwidthInterval[0],
      right = bandwidthInterval[1],
      nextRight = nextNonzero(weights, right);

  if ((nextRight < xval.length) && (xval[nextRight] - xval[i]) < (xval[i] - xval[left])) {
    const nextLeft = nextNonzero(weights, left);
    bandwidthInterval[0] = nextLeft;
    bandwidthInterval[1] = nextRight;
  }
}

function nextNonzero(weights, i) {
  let j = i + 1;
  while (j < weights.length && weights[j] === 0) j++;
  return j;
}