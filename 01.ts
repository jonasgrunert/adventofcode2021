import { readFileToArray, solution } from "./_util.ts";

const arr = await readFileToArray(Number);
// Part 1
export function task1(arr: number[]) {
  return arr.filter((v, i) => v > arr[i - 1]).length;
}
solution(task1(arr));
// Part 2
export function task2(arr: number[]) {
  const sum = (start: number, end: number) =>
    arr.slice(start, end).reduce((p, c) => p + c, 0);
  return arr
    .map((_, i) => (i > 1 ? sum(i - 2, i + 1) : false))
    .filter((_, i, a) => (a[i] && a[i - 1] ? a[i] > a[i - 1] : false)).length;
}
solution(task2(arr));
