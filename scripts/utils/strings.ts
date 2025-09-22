export function toNormalCase(s: string): string {
  return s
    .toLowerCase()
    .replace(/(^\w|(?<=[^\w])\w|\s\w)/g, (m) => m.toUpperCase())
    .replace(/\([\w\d]+\)/g, (m) => m.toUpperCase());
}

export function padZero(num: number, size: number): string {
  let s = num.toString();
  while (s.length < size) s = "0" + s;
  return s;
}
export function toHHMM(date: Date): string {
  const hour = padZero(date.getHours(), 2);
  const minute = padZero(date.getMinutes(), 2);
  return `${hour}:${minute}`;
}
