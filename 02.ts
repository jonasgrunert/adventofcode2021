import { readFileToArray, solution } from "./_util.ts";

const arr = await readFileToArray((val) => {
  const [i, n] = val.split(" ");
  return { i, n: Number(n) };
});

export function task1(input: typeof arr) {
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
}
solution(task1(arr));

export function task2(input: typeof arr) {
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
}
solution(task2(arr));
