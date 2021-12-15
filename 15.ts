import Solution from "./_util.ts";

function adjacent(v: Vertice, maxX: number, maxY: number) {
  const vs: [number, number][] = [];
  if (v.x > 0) vs.push([-1, 0]);
  if (v.y > 0) vs.push([0, -1]);
  if (v.x < maxX) vs.push([1, 0]);
  if (v.y < maxY) vs.push([0, 1]);
  return vs;
}

class Vertice {
  #estimate: number;
  readonly risk: number;
  cumulated = 0;
  readonly x;
  readonly y;

  constructor(s: string, x: number, y: number, xL: number, yL: number) {
    this.risk = Number.parseInt(s);
    this.#estimate = xL - x + yL - y;
    this.x = x;
    this.y = y;
  }

  get f() {
    return this.cumulated + this.#estimate;
  }
}

function solve(arr: Vertice[][]) {
  const maxX = arr.length - 1;
  const maxY = arr[0].length - 1;
  const open = [arr[0][0]];
  const end = arr[maxX][maxY];
  const closed = new Set<Vertice>();
  while (open.length > 0) {
    const curr = open.sort((a, b) => a.f - b.f).shift()!;
    if (curr === end) return curr.cumulated;
    closed.add(curr);
    for (const v of adjacent(curr, maxX, maxY).map(
      ([dx, dy]) => arr[curr.x + dx][curr.y + dy]
    )) {
      if (closed.has(v)) continue;
      const cost = curr.cumulated + v.risk;
      if (open.includes(v) && cost >= v.cumulated) continue;
      v.cumulated = cost;
      if (!open.includes(v)) open.push(v);
    }
  }
  return -1;
}

const task = new Solution(
  (arr: Vertice[][]) => {
    return solve(arr);
  },
  (arr: Vertice[][]) => {
    const maxX = arr.length;
    const maxY = arr[0].length;
    const matrix = Array.from({ length: maxX * 5 }).map((_, x) =>
      Array.from({ length: maxY * 5 }).map((_, y) => {
        const val =
          arr[x % maxX][y % maxY].risk +
          Math.floor(x / maxX) +
          Math.floor(y / maxY);
        return new Vertice(
          `${val > 9 ? val - 9 : val}`,
          x,
          y,
          maxX * 5,
          maxY * 5
        );
      })
    );
    return solve(matrix);
  },
  {
    transform: (a, x, xAxis) =>
      a
        .split("")
        .map(
          (n, y, yAxis) =>
            new Vertice(n, x, y, xAxis.length - 1, yAxis.length - 1)
        ),
    sep: "\n",
  }
);
task.expect(40, 315);

if (import.meta.main) await task.execute();

export default task;
