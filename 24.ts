import Solution from "./solution.ts";

/** All the cool shit never got used :( */
interface Instruction<s extends string> {
  type: s;
  to: string;
  from: string | number;
}
type Inp = Instruction<"inp">;
type Add = Instruction<"add">;
type Mul = Instruction<"mul">;
type Div = Instruction<"div">;
type Mod = Instruction<"mod">;
type Eql = Instruction<"eql">;
type Instructions = Inp | Add | Mul | Div | Mod | Eql;

class Program {
  #state: Record<string, number> = {};
  #instructions: Instructions[] = [];
  constructor(s: Instructions[]) {
    this.#instructions = [...s];
  }

  process(s: string) {
    let idx = 0;
    let ins: Instructions | undefined;
    while ((ins = this.#instructions.shift()) !== undefined) {
      if (ins.type === "inp") this.#state[ins.to] = Number.parseInt(s[idx++]);
      else {
        const from = typeof ins.from === "number"
          ? ins.from
          : this.#state[ins.from];
        const to = this.#state[ins.to] ?? 0;
        switch (ins.type) {
          case "add": {
            this.#state[ins.to] = to + from;
            break;
          }
          case "mul": {
            this.#state[ins.to] = to * from;
            break;
          }
          case "div": {
            this.#state[ins.to] = to / from;
            this.#state[ins.to] = Math.floor(this.#state[ins.to]);
            break;
          }
          case "mod": {
            this.#state[ins.to] = to % from;
            break;
          }
          case "eql": {
            this.#state[ins.to] = this.#state[ins.to] === from ? 1 : 0;
            break;
          }
          default: {
            throw new Error(
              "Unable to process instruction: " + JSON.stringify(ins),
            );
          }
        }
      }
    }
    return this.#state;
  }
}

function* modelNumber() {
  let number = Array.from({ length: 14 }).map(() => 9);
  while (!number.every((n) => n === 0)) {
    yield number.join("");
    number[13]--;
    let i: number;
    while ((i = number.findIndex((n) => n === 0)) !== -1) {
      number[i - 1]--;
      number = number.map((n, x) => (x > i - 1 ? 9 : n));
    }
  }
}

function solve(max = true) {
  return (arr: Instructions[]) => {
    const keyValues: [number, number, number][] = [];
    for (
      let idx = 0, i = 5, j = 15;
      i < arr.length && j < arr.length;
      idx++, i += 18, j += 18
    ) {
      keyValues.push([idx, <number> arr[i].from, <number> arr[j].from]);
    }
    const MONAD: number[] = [];
    const stack: [number, number, number][] = [];
    for (const [idx, x, y] of keyValues) {
      if (x >= 10) stack.push([idx, x, y]);
      else {
        const prev = stack.pop()!;
        if (prev[2] + x >= 0 === max) {
          MONAD[idx] = max ? 9 : 1;
          MONAD[prev[0]] = MONAD[idx] - (prev[2] + x);
        } else {
          MONAD[prev[0]] = max ? 9 : 1;
          MONAD[idx] = MONAD[prev[0]] + (prev[2] + x);
        }
      }
    }
    const m = MONAD.map((n) => n.toString()).join("");
    return m;
  };
}

const task = new Solution(solve(), solve(false), {
  transform: (a) => {
    const res = /(\w{3}) (-?\w+) ?(-?\w+)?/.exec(a);
    if (res === null) throw new Error("Unparseable instruction: " + a);
    const n = Number.parseInt(res[3]);
    return {
      type: res[1],
      to: res[2],
      from: Number.isNaN(n) ? res[3] : n,
    } as Instructions;
  },
  sep: "\n",
});
task.expect("", "");

export default task;
