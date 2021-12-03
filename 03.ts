import Solution from "./_util.ts";

const flip = (bit: string) =>
  bit.replaceAll(/0|1/g, (m) => (m === "1" ? "0" : "1"));

const getParam = (arr: string[], maj: boolean) => {
  let val = arr;
  let i = 0;
  while (val.length !== 1) {
    let count = 0;
    for (let j = 0; j < val.length; j++) {
      count += val[j][i] === "1" ? 1 : -1;
    }
    val = val.filter(
      (v) => v[i] === (maj ? (count >= 0 ? "1" : "0") : count >= 0 ? "0" : "1")
    );
    i++;
  }
  return Number.parseInt(val[0], 2);
};

const task = new Solution(
  (input: string[]) => {
    let gamma = "";
    for (let i = 0; i < input[0].length; i++) {
      let count = 0;
      for (let j = 0; j < input.length; j++) {
        count += input[j][i] === "1" ? 1 : -1;
      }
      gamma += count > 0 ? "1" : "0";
    }
    const epsilon = flip(gamma);
    return Number.parseInt(gamma, 2) * Number.parseInt(epsilon, 2);
  },
  (input) => {
    return getParam(input, true) * getParam(input, false);
  }
);
task.expect(198, 230);

if (import.meta.main) await task.execute();

export default task;
