// Returns the medium value of an array of numbers.
export function sort(arr, fn){
  return arr.sort((a, b) => fn(a) - fn(b))
}