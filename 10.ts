import Solution from "./_util.ts";

const matches = [
  { o: "(", c: ")", v: 3, s: 1 },
  { o: "[", c: "]", v: 57, s: 2 },
  { o: "{", c: "}", v: 1197, s: 3 },
  { o: "<", c: ">", v: 25137, s: 4 },
];

function lineCorruption(a: string) {
  const symbols = [];
  for (const char of a) {
    if (matches.map(({ o }) => o).includes(char)) {
      symbols.push(char);
    } else {
      const open = symbols.pop();
      const close = matches.find(({ c }) => c === char)!;
      if (open !== close.o) return close.v;
    }
  }
  return 0;
}

const task = new Solution(
  (arr: string[]) => arr.map(lineCorruption).reduce((p, c) => p + c, 0),
  (arr: string[]) => {
    const scores = arr
      .filter((a) => lineCorruption(a) === 0)
      .map((line) => {
        let score = 0;
        const symbols = [];
        for (const char of line) {
          if (matches.map(({ o }) => o).includes(char)) {
            symbols.push(char);
          } else {
            symbols.pop();
          }
        }
        while (symbols.length > 0) {
          const fill = symbols.pop();
          const { s } = matches.find(({ o }) => o === fill)!;
          score = score * 5 + s;
        }
        return score;
      });
    return scores.sort((a, b) => a - b)[Math.floor(scores.length / 2)];
  }
);
task.expect(26397, 288957);

if (import.meta.main) await task.execute();

export default task;
