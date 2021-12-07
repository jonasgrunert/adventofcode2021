import Solution from "./_util.ts";

function calc(turns: number) {
  return (arr: number[]) => {
    const school = Array.from({ length: 9 }).map(() => 0);
    arr.forEach((n) => school[n]++);
    for (let i = 0; i < turns; i++) {
      const n = school.shift();
      if (n !== undefined) {
        school[6] += n;
        school.push(n);
      } else {
        throw new Error("Shift produced undefinded");
      }
    }
    return school.reduce((p, c) => p + c);
  };
}

const task = new Solution(calc(80), calc(256), {
  transform: (a) => Number.parseInt(a),
  sep: ",",
});
task.expect(5934, 26984457539);

if (import.meta.main) await task.execute();

export default task;
