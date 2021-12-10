import Solution from "./_util.ts";

function lowestPositions(arr: number[][]) {
  const low = [] as [number, number][];
  arr.forEach((c, x) =>
    c.forEach((curr, y, axis) => {
      const e = [];
      if (x !== 0) e.push(arr[x - 1][y]);
      if (y !== 0) e.push(arr[x][y - 1]);
      if (x !== arr.length - 1) e.push(arr[x + 1][y]);
      if (y !== axis.length) e.push(arr[x][y + 1]);
      if (!e.some((n) => n <= curr)) low.push([x, y]);
    })
  );
  return low;
}

const task = new Solution(
  (arr: number[][]) =>
    arr.reduce(
      (p, c, x) =>
        p +
        c.reduce((prev, curr, y, axis) => {
          const e = [];
          if (x !== 0) e.push(arr[x - 1][y]);
          if (y !== 0) e.push(arr[x][y - 1]);
          if (x !== arr.length - 1) e.push(arr[x + 1][y]);
          if (y !== axis.length) e.push(arr[x][y + 1]);
          return prev + (e.some((n) => n <= curr) ? 0 : curr + 1);
        }, 0),
      0
    ),
  (arr: number[][]) => {
    const low = lowestPositions(arr);
    const basins = new Map<string, Set<string>>(
      low.map((l) => [l.join(), new Set([l.join()])])
    );
    for (let x = 0; x < arr.length; x++) {
      for (let y = 0; y < arr[x].length; y++) {
        if (arr[x][y] !== 9) {
          let curr = [x, y] as [number, number];
          const e = new Set([curr]);
          let found = false;
          while (!found) {
            if (curr[0] !== 0) e.add([curr[0] - 1, curr[1]]);
            if (curr[1] !== 0) e.add([curr[0], curr[1] - 1]);
            if (curr[0] !== arr.length - 1) e.add([curr[0] + 1, curr[1]]);
            if (curr[1] !== arr[curr[0]].length - 1)
              e.add([curr[0], curr[1] + 1]);
            const coord = [...e].find((p) => basins.has(p.join()));
            if (coord) {
              const basin = basins.get(coord.join())!;
              e.forEach((b) => {
                if (arr[b[0]][b[1]] !== 9) {
                  basin.add(b.join());
                }
              });
              found = true;
            } else {
              const lowest = [...e].sort(
                ([x1, y1], [x2, y2]) => arr[x1][y1] - arr[x2][y2]
              )[0];
              curr = lowest;
            }
          }
        }
      }
    }
    return [...basins.values()]
      .map((s) => s.size)
      .sort((a, b) => b - a)
      .slice(0, 3)
      .reduce((p, c) => p * c, 1);
  },
  {
    transform: (s) => s.split("").map((n) => Number.parseInt(n)),
  }
);
task.expect(15, 1134);

if (import.meta.main) await task.execute();

export default task;
