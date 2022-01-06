import Solution from "./_util.ts";

enum Amphipod {
  A,
  B,
  C,
  D,
}

const getEnum = (c: string) => {
  switch (c) {
    case "A":
      return Amphipod.A;
    case "B":
      return Amphipod.B;
    case "C":
      return Amphipod.C;
    case "D":
      return Amphipod.D;
    default:
      return undefined;
  }
};

const fromEnum = (a: Amphipod | undefined) => {
  switch (a) {
    case Amphipod.A:
      return "A";
    case Amphipod.B:
      return "B";
    case Amphipod.C:
      return "C";
    case Amphipod.D:
      return "D";
    default:
      return ".";
  }
};

class State {
  #hallway: Array<Amphipod | undefined>;
  #rooms: Array<Amphipod | undefined>[];
  f = 0;
  prev?: State;

  constructor(s: string) {
    const lines = s.split("\n");
    this.#hallway = lines[1].slice(1, -1).split("").map(getEnum);
    const rooms: Array<Amphipod | undefined>[] = [];
    for (let i = 0; i < 4; i++) {
      for (let y = 2; y < lines.length - 1; y++) {
        if (rooms[i]) rooms[i][y - 2] = getEnum(lines[y][i * 2 + 3]);
        else rooms[i] = [getEnum(lines[y][i * 2 + 3])];
      }
    }
    this.#rooms = rooms;
  }

  encode(): string {
    const ceil = "".padStart(13, "#");
    const hall = `#${this.#hallway.map(fromEnum).join("")}#`;
    let rooms = "";
    for (let i = 0; i < this.#rooms[0].length; i++) {
      rooms +=
        "###" + this.#rooms.map((m) => fromEnum(m[i])).join("#") + "###\n";
    }
    return [ceil, hall, rooms.slice(0, -1), ceil].join("\n");
  }

  static goal(idx: number) {
    const ceil = "".padStart(13, "#");
    const hall = "#".concat("".padStart(11, "."), "#");
    const s = "###".concat(["A", "B", "C", "D"].join("#"), "###");
    return new State(
      [
        ceil,
        hall,
        Array.from({ length: idx })
          .map(() => s)
          .join("\n"),
        ceil,
      ].join("\n")
    );
  }

  isRoomEnter(index: number) {
    return this.#rooms[index].every((a) => a === undefined || a === index);
  }

  rooomTo(index: number) {
    return 2 + index * 2;
  }

  isAbove(index: number) {
    if (index < 2 || index > this.#hallway.length - 3) return false;
    return index % 2 === 0;
  }

  isClear(from: number, to: number) {
    if (from === to) return true;
    const way =
      from < to
        ? this.#hallway.slice(from + 1, to + 1)
        : this.#hallway.slice(to, from);
    return way.every((w) => w === undefined);
  }

  emptySpaces(index: number) {
    const left = this.#hallway
      .slice(0, index)
      .findLastIndex((x) => x !== undefined);
    const right = this.#hallway
      .slice(index + 1)
      .findIndex((x) => x !== undefined);
    return this.#hallway
      .map((_, i) => i)
      .slice(left + 1, right < 0 ? undefined : right + index + 1)
      .filter((i) => i !== index);
  }

  get depth() {
    return this.#rooms[0].length;
  }

  get roomToHall() {
    return this.#rooms.flatMap((r, i) => {
      if (this.isRoomEnter(i)) return [];
      const [amphipod, depth] = r
        .map((a, x) => [a, x])
        .find(([a]) => a !== undefined)!;
      const curr = this.rooomTo(i);
      return this.emptySpaces(curr)
        .map((target) => {
          if (this.isAbove(target)) return false;
          const steps = depth! + 1 + Math.abs(curr - target);
          const energy = steps * Math.pow(10, amphipod!);
          const state = new State(this.encode());
          const val = state.#rooms[i][depth!];
          state.#rooms[i][depth!] = state.#hallway[target];
          state.#hallway[target] = val;
          return [state, energy] as [State, number];
        })
        .filter((t) => t !== false) as [State, number][];
    });
  }

  get hallToRoom() {
    return this.#hallway
      .map((amphipod, curr) => {
        if (amphipod === undefined) return false;
        if (!this.isRoomEnter(amphipod)) return false;
        const target = this.rooomTo(amphipod);
        if (!this.isClear(curr, target)) return false;
        const depth = this.#rooms[amphipod].findLastIndex(
          (r) => r === undefined
        );
        const steps = depth! + 1 + Math.abs(curr - target);
        const energy = steps * Math.pow(10, amphipod!);
        const state = new State(this.encode());
        const val = state.#rooms[amphipod][depth!];
        state.#rooms[amphipod][depth!] = state.#hallway[curr];
        state.#hallway[curr] = val;
        return [state, energy] as [State, number];
      })
      .filter((c) => c !== false) as Array<[State, number]>;
  }

  get transitions() {
    return [...this.roomToHall, ...this.hallToRoom].map((m) => {
      m[0].prev = this;
      return m;
    });
  }

  get h_score() {
    return 0;
  }
}

function solve(state: State) {
  const open = [state];
  const closed = new Map<string, number>([[state.encode(), 0]]);
  while (open.length > 0) {
    const curr = open.sort((a, b) => a.f - b.f).shift()!;
    if (curr.encode() === State.goal(state.depth).encode()) return curr.f;
    const g = closed.get(curr.encode())!;
    for (const [next, cost] of curr.transitions) {
      const p = g + cost;
      if (p < (closed.get(next.encode()) ?? Number.MAX_SAFE_INTEGER)) {
        closed.set(next.encode(), p);
        next.f = next.h_score + p;
        open.push(next);
      }
    }
  }
  return closed.get(State.goal(state.depth).encode()) ?? -1;
}

const task = new Solution(
  (arr: State[]) => {
    return solve(arr[0]);
  },
  (arr: State[]) => {
    const start = arr[0].encode().split("\n");
    const state = new State(
      start
        .slice(0, 3)
        .concat(["  #D#C#B#A#", "  #D#B#A#C#"], start.slice(3))
        .join("\n")
    );
    return solve(state);
  },
  { transform: (t) => new State(t), sep: "\n\n" }
);
task.expect(12521, 44169);

if (import.meta.main) await task.execute();

export default task;
