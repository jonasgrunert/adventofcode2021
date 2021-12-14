import Solution from "./_util.ts";

function createPoly(poly: string, rules: [string, string][]) {
  return poly
    .slice(1)
    .split("")
    .reduce((p, c) => {
      const pair = `${p[p.length - 1]}${c}`;
      const rule = rules.find((f) => f[0] === pair);
      if (rule) {
        return p + rule[1] + c;
      }
      return p + c;
    }, poly[0]);
}

function analyzePolymer(poly: string) {
  const result = new Map<string, number>();
  for (const c of poly) {
    result.set(c, (result.get(c) ?? 0) + 1);
  }
  const arr = [...result.values()].sort((a, b) => a - b);
  return arr[arr.length - 1] - arr[0];
}

const task = new Solution(
  (papers: Array<string | [string, string][]>) => {
    let [polymer, rules] = papers as [string, [string, string][]];
    for (let i = 0; i < 10; i++) polymer = createPoly(polymer, rules);
    return analyzePolymer(polymer);
  },
  (papers: Array<string | [string, string][]>) => {
    const [polymer, rules] = papers as [string, [string, string][]];
    let prev = new Map<string, number>();
    const symbols = new Map<string, number>();
    polymer
      .split("")
      .map((c, i, m) => {
        symbols.set(c, (symbols.get(c) ?? 0) + 1);
        return m.slice(i, i + 2).join("");
      })
      .forEach((m) => {
        if (m.length === 2) prev.set(m, (prev.get(m) ?? 0) + 1);
      });
    for (let i = 0; i < 40; i++) {
      const curr = new Map<string, number>();
      for (const [key, value] of prev) {
        const rule = rules.find((f) => f[0] === key);
        if (rule) {
          const [s, e] = key.split("");
          symbols.set(rule[1], (symbols.get(rule[1]) ?? 0) + value);
          curr.set(s + rule[1], (curr.get(s + rule[1]) ?? 0) + value);
          curr.set(rule[1] + e, (curr.get(rule[1] + e) ?? 0) + value);
          curr.set(key, curr.get(key) ?? 0);
        }
      }
      prev = curr;
    }
    const arr = [...symbols.values()].sort((a, b) => a - b);
    return arr[arr.length - 1] - arr[0];
  },
  {
    transform: (a, i) =>
      i === 0
        ? a
        : a.split("\n").map((t) => t.split(" -> ") as [string, string]),
    sep: "\n\n",
  }
);
task.expect(1588, 2188189693529);

if (import.meta.main) await task.execute();

export default task;
