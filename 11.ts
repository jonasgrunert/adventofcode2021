import Solution from "./_util.ts";

class Octos {
  #board: { value: number; flashed: boolean }[][];
  #x = 0;
  #y = 0;

  constructor(b: number[][]) {
    this.#board = b.map((a) => a.map((v) => ({ value: v, flashed: false })));
    this.#x = this.#board.length;
    this.#y = this.#board[0].length;
  }

  #flash([xstart, xend]: [number, number], [ystart, yend]: [number, number]) {
    for (let x = Math.max(0, xstart); x < Math.min(xend, this.#x); x++) {
      for (let y = Math.max(0, ystart); y < Math.min(yend, this.#y); y++) {
        if (
          x >= 0 &&
          y >= 0 &&
          ++this.#board[x][y].value > 9 &&
          !this.#board[x][y].flashed
        ) {
          this.#board[x][y].flashed = true;
          this.#flash([x - 1, x + 2], [y - 1, y + 2]);
        }
      }
    }
  }

  round() {
    this.#flash([0, this.#x], [0, this.#y]);
    let flashes = 0;
    for (let x = 0; x < this.#x; x++) {
      for (let y = 0; y < this.#y; y++) {
        if (this.#board[x][y].flashed) {
          this.#board[x][y].flashed = false;
          this.#board[x][y].value = 0;
          flashes++;
        }
      }
    }
    return flashes;
  }

  get size() {
    return this.#x * this.#y;
  }
}

const task = new Solution(
  (arr: number[][]) => {
    let flashes = 0;
    const o = new Octos(arr);
    for (let i = 0; i < 100; i++) {
      flashes += o.round();
    }
    return flashes;
  },
  (arr: number[][]) => {
    let rounds = 1;
    const o = new Octos(arr);
    while (o.round() !== o.size) {
      rounds++;
    }
    return rounds;
  },
  { transform: (a) => a.split("").map((n) => Number.parseInt(n)) }
);
task.expect(1656, 195);

if (import.meta.main) await task.execute();

export default task;
