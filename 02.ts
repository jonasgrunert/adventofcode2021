import Solution from "./_util.ts";

const transform = (val: string) => {
  const [i, n] = val.split(" ");
  return { i, n: Number(n) };
};

const task = new Solution(
  (input) => {
    const { h, d } = input.reduce(
      (p, c) => {
        switch (c.i) {
          case "forward":
            return { ...p, h: p.h + c.n };
          case "down":
            return { ...p, d: p.d + c.n };
          case "up":
            return { ...p, d: p.d - c.n };
          default:
            throw new Error(`Unknown action ${c.i}`);
        }
      },
      { h: 0, d: 0 }
    );
    return h * d;
  },
  (input) => {
    const { h, d } = input.reduce(
      (p, c) => {
        switch (c.i) {
          case "forward":
            return { ...p, h: p.h + c.n, d: p.d + p.a * c.n };
          case "down":
            return { ...p, a: p.a + c.n };
          case "up":
            return { ...p, a: p.a - c.n };
          default:
            throw new Error(`Unknown action ${c.i}`);
        }
      },
      { h: 0, d: 0, a: 0 }
    );
    return h * d;
  },
  {
    transform,
  }
);
task.expect(150, 900);

if (import.meta.main) await task.execute();

export default task;
