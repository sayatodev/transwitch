export function clamp(num: number, [min, max]: [number, number]): number {
  return num <= min ? min : num >= max ? max : num;
}
