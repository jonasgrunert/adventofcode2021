import Solution from "./solution.ts";

class System {
  static #caves = new Map<string, Cave>();

  static addPath(path: string) {
    const [from, to] = path.split("-");
    const f = this.#caves.get(from) ?? new Cave(from);
    const t = this.#caves.get(to) ?? new Cave(to);
    if (to !== "start") f.addConnection(t);
    if (from !== "start") t.addConnection(f);
  }

  static addCave(cave: Cave) {
    this.#caves.set(cave.name, cave);
  }

  static get start() {
    return this.#caves.get("start")!;
  }

  static get end() {
    return this.#caves.get("end")!;
  }
  static get display() {
    return [...this.#caves.values()].map(
      (v) => `${v.name} -> ${v.connections}`
    );
  }
}

class Cave {
  #name: string;
  #big: boolean;
  #links = new Set<Cave>();

  constructor(name: string) {
    this.#name = name;
    this.#big = name.toUpperCase() === name;
    System.addCave(this);
  }

  get name() {
    return this.#name;
  }
  get connections() {
    return [...this.#links].map((n) => n.name).join();
  }

  addConnection(cave: Cave) {
    this.#links.add(cave);
  }

  dfs(stack: Cave[], sec = true): number {
    if (this === System.end) {
      return 1;
    }
    if (
      !this.#big &&
      stack.includes(this) &&
      (sec || stack.some((c, i, s) => !c.#big && s.slice(i + 1).includes(c)))
    ) {
      return 0;
    }
    stack.push(this);
    const val = [...this.#links].reduce((p, c) => {
      return p + c.dfs(stack, sec);
    }, 0);
    stack.pop();
    return val;
  }
}

const task = new Solution(
  () => {
    const start = System.start;
    const stack: Cave[] = [];
    return start.dfs(stack);
  },
  () => {
    const start = System.start;
    const stack: Cave[] = [];
    return start.dfs(stack, false);
  },
  {
    transform: (a) => System.addPath(a),
  }
);
task.expect(226, 3509);

export default task;
