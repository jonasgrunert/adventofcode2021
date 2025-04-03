import Solution from "./solution.ts";

const task = new Solution(
  (arr: string[]) => {
    console.log();
    let count = 0;
    let map = arr.join("\n");
    let prev;
    while (prev !== map) {
      prev = map;
      map = map.replace(/^\..+>$|>\./gm, (m) =>
        m.length === 2
          ? ".>"
          : ">".concat(m.slice(1, -1).replace(/>\./g, ".>"), ".")
      );
      const n = map.split("\n").map((p) => p.split(""));
      const p = Array.from(n.map((m) => Array.from(m)));
      p.forEach((line, x) => {
        line.forEach((char, y) => {
          if (char !== "v") return;
          const pos = x === n.length - 1 ? p[0][y] : p[x + 1][y];
          if (pos === ".") {
            n[x === n.length - 1 ? 0 : x + 1][y] = "v";
            n[x][y] = ".";
          }
        });
      });
      map = n.map((l) => l.join("")).join("\n");
      count++;
    }
    return count;
  },
  {
    sep: "\n",
  }
);
task.expect(58);

export default task;
