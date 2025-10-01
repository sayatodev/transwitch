export function clamp(num: number, [min, max]: [number, number]): number {
  return num <= min ? min : num >= max ? max : num;
}

export function get_closest(num: number, arr: number[]): number {
  return arr.reduce((a, b) => {
    return Math.abs(b - num) < Math.abs(a - num) ? b : a;
  });
}
