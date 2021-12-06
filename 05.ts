import Solution from "./_util.ts";

type line = [[number, number], [number, number]];

class Line {
  #x1: number;
  #x2: number;
  #y1: number;
  #y2: number;
  #step: { x: number; y: number };
  #steps: number;

  constructor(s: string) {
    const [[x1, y1], [x2, y2]] = s
      .split(" -> ")
      .map((s) => s.split(",").map((n) => Number.parseInt(n))) as line;
    this.#x1 = x1;
    this.#x2 = x2;
    this.#y1 = y1;
    this.#y2 = y2;
    const { x, y } = { x: this.#x2 - this.#x1, y: this.#y2 - this.#y1 };
    this.#steps = Math.abs(x) > Math.abs(y) ? Math.abs(x) : Math.abs(y);
    this.#step = { x: x / this.#steps, y: y / this.#steps };
  }

  get maxX() {
    return this.#x1 > this.#x2 ? this.#x1 : this.#x2;
  }

  get maxY() {
    return this.#y1 > this.#y2 ? this.#y1 : this.#y2;
  }

  isHorizontal() {
    return this.#x1 === this.#x2 || this.#y1 === this.#y2;
  }

  [Symbol.iterator]() {
    let i = 0;
    return {
      next: () => {
        const curr = i;
        i++;
        return {
          done: curr - 1 === this.#steps,
          value: {
            x: this.#x1 + curr * this.#step.x,
            y: this.#y1 + curr * this.#step.y,
          },
        };
      },
    };
  }

  toString() {
    return `${this.#x1},${this.#y1} -> ${this.#x2},${this.#y2}`;
  }
}

function solution(hor: boolean) {
  return (arr: Array<Line>) => {
    const lines = hor ? arr.filter((l) => l.isHorizontal()) : arr;
    const maxX = lines.reduce((p, c) => (c.maxX > p ? c.maxX : p), 0) + 1;
    const maxY = lines.reduce((p, c) => (c.maxY > p ? c.maxY : p), 0) + 1;
    const grid = Array.from({ length: maxX }).map(() =>
      Array.from({ length: maxY }).map(() => 0)
    );
    lines.forEach((line) => {
      for (const point of line) {
        if (point) grid[point.x][point.y]++;
      }
    });
    return grid.reduce(
      (p, c) => p + c.reduce((prev, curr) => (curr > 1 ? prev + 1 : prev), 0),
      0
    );
  };
}
const task = new Solution(solution(true), solution(false), {
  //x1, y1 x2,y2
  transform: (a) => new Line(a),
});
task.expect(5, 12);

if (import.meta.main) await task.execute();

export default task;
