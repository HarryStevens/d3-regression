// Sort an array using an accessor.
export function sort(arr, fn){
  return arr.sort((a, b) => fn(a) - fn(b));
}