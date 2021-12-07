import Solution from "./_util.ts";

const task = new Solution(
  (arr: number[]) => {
    const med = arr.sort((a, b) => b - a)[arr.length / 2];
    return arr.reduce((p, c) => p + Math.abs(c - med), 0);
  },
  (arr: number[]) => {
    const avg = arr.reduce((p, c) => p + c) / arr.length;
    const avgs = [Math.floor(avg), Math.ceil(avg)];
    return avgs
      .map((a) =>
        arr.reduce((p, c) => {
          const diff = Math.abs(c - a);
          return p + Math.round((diff * (diff + 1)) / 2);
        }, 0)
      )
      .reduce((p, c) => (p > c ? c : p));
  },
  {
    transform: (a) => Number.parseInt(a),
    sep: ",",
  }
);
task.expect(37, 168);

if (import.meta.main) await task.execute();

export default task;
