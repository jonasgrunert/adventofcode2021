import Solution from "./solution.ts";

const transform = (a: string) => {
  const [signals, digits] = a.split(" | ");
  return {
    signal: signals.split(" ").map((s) => s.split("").sort().join("")),
    digits: digits.split(" ").map((s) => s.split("").sort().join("")),
  };
};

function includes(string: string, search = "") {
  return search.split("").every((s) => string.includes(s));
}

function diff(a = "", b = "") {
  for (const letter of a) {
    if (!b.includes(letter)) return letter;
  }
  return "";
}

function solveLine(signal: ReturnType<typeof transform>["signal"]) {
  const m = [] as string[];
  m[1] = signal.find((s) => s.length === 2)!;
  m[4] = signal.find((s) => s.length === 4)!;
  m[7] = signal.find((s) => s.length === 3)!;
  m[8] = signal.find((s) => s.length === 7)!;
  m[3] = signal.find((s) => s.length === 5 && includes(s, m[1]))!;
  const ltop = diff(m[4], m[3]);
  m[5] = signal.find((s) => s.length === 5 && s.includes(ltop))!;
  m[2] = signal.find((s) => s.length === 5 && s !== m[3] && s !== m[5])!;
  m[0] = signal.find((s) => s.length === 6 && !includes(s, m[5]))!;
  m[9] = signal.find((s) => s.length === 6 && includes(s, m[3]))!;
  m[6] = signal.find((s) => s.length === 6 && s !== m[9] && s !== m[0])!;
  return new Map(m.map((key, value) => [key, value]));
}

const task = new Solution(
  (arr) =>
    arr.reduce(
      (p, c) =>
        p +
        c.digits.filter(
          ({ length }) =>
            length === 2 || length === 3 || length === 4 || length === 7
        ).length,
      0
    ),
  (arr) =>
    arr.reduce((p, c) => {
      const map = solveLine(c.signal);
      const val = c.digits.reduce(
        (prev, curr, i) => prev + map.get(curr)! * Math.pow(10, 3 - i),
        0
      );
      if (Number.isNaN(val)) console.log(map, c);
      return (
        p +
        c.digits.reduce(
          (prev, curr, i) => prev + map.get(curr)! * Math.pow(10, 3 - i),
          0
        )
      );
    }, 0),
  {
    transform,
    sep: "\n",
  }
);
task.expect(26, 61229);

export default task;
