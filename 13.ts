import Solution from "./solution.ts";

class Paper {
  #points = new Set<string>();
  #folds = [] as ["x" | "y", number][];

  constructor([points, folds]: string[]) {
    points.split("\n").forEach((n) => this.#points.add(n));
    this.#folds = folds.split("\n").map((f) => {
      const [a, n] = f.slice(11).split("=");
      return [a, Number.parseInt(n)] as ["x" | "y", number];
    });
  }

  fold() {
    const f = this.#folds.shift();
    if (f) {
      [...this.#points].forEach((point) => {
        const [x, y] = point.split(",").map((n) => Number.parseInt(n));
        switch (f[0]) {
          case "x": {
            if (x > f[1]) {
              this.#points.delete(point);
              this.#points.add(`${f[1] - (x - f[1])},${y}`);
            }
            break;
          }
          case "y": {
            if (y > f[1]) {
              this.#points.delete(point);
              this.#points.add(`${x},${f[1] - (y - f[1])}`);
            }
            break;
          }
        }
      });
    }
    return this;
  }

  get count() {
    return this.#points.size;
  }

  display() {
    while (this.#folds.length > 0) {
      this.fold();
    }
    const p = [...this.#points].map((p) =>
      p.split(",").map((n) => Number.parseInt(n))
    );
    const maxX = p.reduce((p, c) => Math.max(p, c[0]), 0);
    const maxY = p.reduce((p, c) => Math.max(p, c[0]), 0);
    return (
      "\n" +
      Array.from({ length: maxX + 1 })
        .map((_, x) =>
          Array.from({ length: maxY + 1 })
            .map((_, y) => (this.#points.has(`${x},${y}`) ? "X" : " "))
            .join("")
        )
        .join("\n")
    );
  }
}

const task = new Solution(
  (papers: Paper[]) => {
    const [pap] = papers;
    return pap.fold().count;
  },
  (papers: Paper[]) => {
    const [pap] = papers;
    const val = pap.display();
    return val;
  },
  {
    transform: (_a, _i, arr) => new Paper(arr),
    sep: "\n\n",
  }
);
task.expect(
  17,
  `
XXXXX
X   X
X   X
X   X
XXXXX`
);

export default task;
