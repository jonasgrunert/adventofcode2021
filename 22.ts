import Solution from "./solution.ts";
type T = [number, number];

type Instruction = {
  turn: boolean;
  x: T;
  y: T;
  z: T;
};

function toIns(s: string): Instruction {
  const [_, turn, x0, x1, y0, y1, z0, z1] =
    /(on|off) x=(-?\d+)..(-?\d+),y=(-?\d+)..(-?\d+),z=(-?\d+)..(-?\d+)/.exec(
      s
    )!;
  return {
    turn: turn === "on",
    x: [x0, x1].map((n) => Number.parseInt(n)) as T,
    y: [y0, y1].map((n) => Number.parseInt(n)) as T,
    z: [z0, z1].map((n) => Number.parseInt(n)) as T,
  };
}

function solve(arr: Instruction[]) {
  const regions = new Map<string, number>();
  for (const ins of arr) {
    const r = new Map<string, number>();
    const coords = [...ins.x, ...ins.y, ...ins.z];
    for (const [key, value] of regions) {
      const n = key.split(",").map((n) => Number.parseInt(n));
      const vals = coords.map((v, i) =>
        i % 2 === 0 ? Math.max(v, n[i]) : Math.min(v, n[i])
      );
      if (vals[0] <= vals[1] && vals[2] <= vals[3] && vals[4] <= vals[5]) {
        const id = vals.join();
        r.set(id, (r.get(id) ?? 0) - value);
      }
    }
    const id = coords.join();
    if (ins.turn) r.set(id, (r.get(id) ?? 0) + 1);
    for (const [key, val] of r) {
      regions.set(key, (regions.get(key) ?? 0) + val);
    }
  }
  return [...regions].reduce((p, [key, val]) => {
    const [x0, x1, y0, y1, z0, z1] = key
      .split(",")
      .map((n) => Number.parseInt(n));
    return p + (x1 - x0 + 1) * (y1 - y0 + 1) * (z1 - z0 + 1) * val;
  }, 0);
}

const task = new Solution(
  (arr: Instruction[]) => {
    const clamped = arr
      .map((i) => {
        i.x = [Math.max(-50, i.x[0]), Math.min(50, i.x[1])];
        i.y = [Math.max(-50, i.y[0]), Math.min(50, i.y[1])];
        i.z = [Math.max(-50, i.z[0]), Math.min(50, i.z[1])];
        return i;
      })
      .filter((i) => i.x[0] <= i.x[1] && i.y[0] <= i.y[1] && i.z[0] <= i.z[1]);
    return solve(clamped);
  },
  solve,
  {
    transform: (s) => toIns(s),
  }
);
task.expect(474140, 2758514936282235);

export default task;
