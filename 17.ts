import Solution from "./_util.ts";

type Area = { x: [number, number]; y: [number, number] };

function pos(min: number, max: number) {
  let poss = 0;
  for (let i = 0; i < min - 1; i++) {
    let pos = 0;
    while (pos <= max) {
      if (pos >= min) {
        poss++;
        break;
      }
      pos += pos + 1;
    }
  }
  return poss;
}

const task = new Solution(
  (arr: Area[]) => {
    const v = Math.abs(arr[0].y[0]);
    return (v * (v - 1)) / 2;
  },
  (arr: Area[]) => {
    const maxY = Math.abs(arr[0].y[1]);
    const minY = Math.abs(arr[0].y[0]);
    const yDis = [minY - maxY + 1];
    for (let y = 1 - minY; y < maxY; y++) {
      let pos = y;
      let count = 0;
      while (pos <= minY) {
        if (pos >= maxY) {
          yDis[count] = (yDis[count] ?? 0) + 1;
        }
        count++;
        pos += y + count;
      }
    }
    let x0 = 0;
    let from = 0;
    const xDis = [arr[0].x[1] - arr[0].x[0] + 1];
    for (let x = 0; x < arr[0].x[0]; x++) {
      let pos = x;
      let count = 0;
      while (pos <= arr[0].x[1] && x - count > 0) {
        if (pos >= arr[0].x[0]) {
          if (x - count === 0) {
            x0++;
            from = from === 0 ? x : from;
          }
          xDis[count] = (xDis[count] ?? 0) + 1 + (count >= from ? x0 : 0);
          console.log("x", x, count);
        }
        count++;
        pos += x - count;
      }
    }
    console.log(xDis, yDis, x0);
    return yDis.reduce((p, c, i) => {
      return p + c * (xDis[i] ?? x0);
    }, 0);
  },
  {
    transform: (a) => {
      const val = a
        .slice(13)
        .split(", ")
        .map((n) =>
          n
            .slice(2)
            .split("..")
            .map((x) => Number.parseInt(x))
        );
      return {
        x: val[0].sort((a, b) => a - b),
        y: val[1].sort((a, b) => a - b),
      } as Area;
    },
  }
);
task.expect(45, 122);

if (import.meta.main) await task.execute();

export default task;
