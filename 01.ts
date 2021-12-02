import Solution from "./_util.ts";

const task = new Solution(
  (arr: number[]) => arr.filter((v, i) => v > arr[i - 1]).length,
  (arr: number[]) => {
    const sum = (start: number, end: number) =>
      arr.slice(start, end).reduce((p, c) => p + c, 0);
    return arr
      .map((_, i) => (i > 1 ? sum(i - 2, i + 1) : false))
      .filter((_, i, a) => (a[i] && a[i - 1] ? a[i] > a[i - 1] : false)).length;
  },
  { transform: (a) => Number(a) }
);

if (import.meta.main) await task.execute();

export default task;
