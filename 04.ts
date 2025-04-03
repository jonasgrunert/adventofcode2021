import Solution from "./solution.ts";

class Board {
  _type = "board";
  state: Array<number | true>[];
  map = new Map<number, [number, number]>();
  constructor(input: string) {
    this.state = input.split(/\n ?/).map((r) =>
      r
        .split(/ {1,2}/)
        .map((n) => Number.parseInt(n))
        .filter((n) => !Number.isNaN(n))
    );
    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        this.map.set(this.state[i][j] as number, [i, j]);
      }
    }
  }

  check() {
    //hor 0-l, ver l-2l
    const bingo = Array.from({ length: this.state.length * 2 }).map(() => true);
    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (typeof this.state[i][j] === "number") {
          bingo[i] = false;
          bingo[this.state.length + j] = false;
        }
      }
    }
    return bingo.some(Boolean);
  }

  calc() {
    return [...this.map.keys()].reduce((p, c) => p + c, 0);
  }

  draw(n: number) {
    if (this.map.has(n)) {
      const [i, j] = this.map.get(n)!;
      this.state[i][j] = true;
      this.map.delete(n);
      if (this.check()) return this.calc() * n;
      return -1;
    }
    return -1;
  }
}

const task = new Solution(
  (arr: Array<number[] | Board>) => {
    const nums = arr[0] as number[];
    const boards = arr.slice(1) as Board[];
    let i = 0;
    while (i < nums.length) {
      const res = boards.map((board) => board.draw(nums[i]));
      i++;
      if (res.some((n) => n > -1)) return res.find((n) => n > -1);
    }
    return -1;
  },
  (arr: Array<number[] | Board>) => {
    const nums = arr[0] as number[];
    let boards = arr.slice(1) as Board[];
    let i = 0;
    while (i < nums.length && boards.length !== 1) {
      boards = boards.filter((board) => board.draw(nums[i]) === -1);
      i++;
    }
    const board = boards[0];
    let num = -1;
    while (num === -1) {
      num = board.draw(nums[i]);
      i++;
    }
    return num;
  },
  {
    transform: (a, i) => (i === 0 ? a.split(",").map(Number) : new Board(a)),
    sep: "\n\n",
  }
);
task.expect(4512, 1924);

export default task;
