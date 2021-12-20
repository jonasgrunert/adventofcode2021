import Solution from "./_util.ts";

type Area = { x: [number, number]; y: [number, number] };

const task = new Solution(
  (arr: Area[]) => {
    const v = Math.abs(arr[0].y[0]);
    return (v * (v - 1)) / 2;
  },
  (arr: Area[]) => {
    let count =
      Math.abs(arr[0].y[1] + 1 - arr[0].y[0]) * (arr[0].x[1] + 1 - arr[0].x[0]);
    for (let y = arr[0].y[1]; y < -arr[0].y[0]; y++) {
      for (let x = 0; x < arr[0].x[0]; x++) {
        let steps = 0,
          xpos = x,
          ypos = y;
        while (xpos <= arr[0].x[1] && ypos >= arr[0].y[0]) {
          if (xpos >= arr[0].x[0] && ypos <= arr[0].y[1]) {
            count++;
            break;
          }
          steps++;
          xpos += Math.max(0, x - steps);
          ypos += y - steps;
          if (x - steps <= 0 && xpos < arr[0].x[0]) {
            break;
          }
        }
      }
    }
    return count;
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
task.expect(45, 112);

if (import.meta.main) await task.execute();

export default task;
