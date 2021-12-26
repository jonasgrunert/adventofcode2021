import Solution from "./_util.ts";

const replaceAdd = (s: string, left = true) => {
  const reS = String.raw`${left ? "" : "^"}(\d+)(\D+)(\d+)${left ? "$" : ""}`;
  const re = new RegExp(reS);
  const res = s.replace(
    re,
    (_, g1, g2, g3) =>
      `${left ? "" : g2}${Number.parseInt(g1) + Number.parseInt(g3)}${
        left ? g2 : ""
      }`
  );
  if (res != s) return res;
  const replace = String.raw`${left ? "\\[" : ""}\d+${left ? "" : "\\]"}`;
  return s.replace(new RegExp(replace), left ? "0]" : "[0");
};

class Parser {
  #lev = /(\[|\])/g;
  #num = /\d+/g;
  #re = /(\[|\]|\d+|,)/g;
  #snail: string;

  constructor(s: string) {
    this.#snail = s;
  }

  numIndex() {
    const from = this.#lev.lastIndex;
    this.#num.lastIndex = from;
    this.#num.exec(this.#snail);
    return this.#num.lastIndex;
  }

  explode() {
    const idx = this.numIndex();
    const left = replaceAdd(this.#snail.slice(0, idx));
    const right = replaceAdd(this.#snail.slice(idx + 1), false);
    this.#snail = `${left.slice(0, -1)}${
      left[left.length - 1] === "[" && right[0] === "]" ? "0" : ""
    }${right.slice(1)}`;
  }

  split() {
    const re = /\d+/y;
    re.lastIndex = this.#num.lastIndex - 2;
    this.#snail = this.#snail.replace(re, (m) => {
      const n = Number.parseInt(m);
      return `[${Math.floor(n / 2)},${Math.ceil(n / 2)}]`;
    });
  }

  reduce(): string {
    let dirty = true;
    while (dirty) {
      dirty = false;
      let level = 0;
      let match: RegExpExecArray | null;
      this.#lev.lastIndex = 0;
      while ((match = this.#lev.exec(this.#snail)) !== null) {
        level += match[0] === "[" ? 1 : -1;
        if (level === 5) {
          this.explode();
          dirty = true;
          break;
        }
      }
      this.#num.lastIndex = 0;
      while (
        (match = this.#num.exec(this.#snail)) !== null &&
        dirty === false
      ) {
        const n = Number.parseInt(match[0]);
        if (n > 9) {
          this.split();
          dirty = true;
          break;
        }
      }
    }
    return this.#snail;
  }

  sum(): number {
    let sum = 0;
    let match: RegExpExecArray | null;
    let left = true;
    while ((match = this.#re.exec(this.#snail)) !== null) {
      switch (match[0]) {
        case "[": {
          sum += this.sum() * (left ? 3 : 2);
          break;
        }
        case "]": {
          return sum;
        }
        case ",": {
          left = false;
          break;
        }
        default: {
          const n = Number.parseInt(match[0]);
          sum += n * (left ? 3 : 2);
        }
      }
    }
    return sum / 3;
  }
}

const task = new Solution(
  (arr: string[]) => {
    const val = arr.reduce((p, c) => new Parser(`[${p},${c}]`).reduce());
    return new Parser(val).sum();
  },
  (arr: string[]) => {
    const val = arr
      .flatMap((e, i) =>
        arr
          .slice(i)
          .flatMap((f) => [
            new Parser(`[${e},${f}]`).reduce(),
            new Parser(`[${f},${e}]`).reduce(),
          ])
      )
      .map((s) => new Parser(s).sum());
    return val.sort((a, b) => b - a)[0];
  }
);
task.expect(4140, 3993);

if (import.meta.main) await task.execute();

export default task;
