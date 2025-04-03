import Solution from "./solution.ts";

function* dice(sides: number): Generator<number, number, undefined> {
  let count = 1;
  while (true) {
    yield count++ % sides;
  }
}

class Player {
  #score: number;
  #position: number;
  constructor(start: number, score = 0) {
    this.#position = start;
    this.#score = score;
  }

  move(fwd: number) {
    this.#position = (this.#position + fwd) % 10;
    this.#score += this.#position + 1;
    return this.#position;
  }

  get score() {
    return this.#score;
  }

  get position() {
    return this.#position;
  }

  of() {
    const p = new Player(this.#position, this.#score);
    return p;
  }
}

const task = new Solution(
  (arr: Player[]) => {
    const die = dice(100);
    let idx = 0;
    while (!arr.some((p) => p.score >= 1000)) {
      let sum = 0;
      for (let i = 0; i < 3; i++) {
        sum += die.next().value;
      }
      arr[idx++ % arr.length].move(sum);
    }
    return idx * 3 * (arr.find((p) => p.score < 1000)?.score ?? 0);
  },
  (arr: Player[]) => {
    const cache = new Map<string, [number, number]>();
    function solveDim(p1: Player, p2: Player): [number, number] {
      if (p2.score >= 21) return [0, 1];
      const id = [p1.position, p2.position, p1.score, p2.score].join();
      if (cache.has(id)) return cache.get(id)!;
      let res: [number, number] = [0, 0];
      for (let d1 = 1; d1 <= 3; d1++) {
        for (let d2 = 1; d2 <= 3; d2++) {
          for (let d3 = 1; d3 <= 3; d3++) {
            const p = p1.of();
            p.move(d1 + d2 + d3);
            const [a, b] = solveDim(p2.of(), p);
            res = [res[0] + b, res[1] + a];
          }
        }
      }
      cache.set(id, res);
      return res;
    }
    return Math.max(...solveDim(arr[0], arr[1]));
  },
  {
    transform: (s) => new Player(Number.parseInt(/\d+$/.exec(s)![0]) - 1),
  }
);
task.expect(739785, 444356092776315);

export default task;
