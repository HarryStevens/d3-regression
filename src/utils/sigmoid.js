export function sigmoid(x){
  return x > 709 ? 1 : x < -709 ? 0 : 1 / (1 + Math.exp(-x));
}
