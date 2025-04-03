import Solution from "./solution.ts";

type Image = {
  points: Set<string>;
  borders: { x: [number, number]; y: [number, number] };
  default: string;
};

function imageFromString(s: string): Image {
  const x: [number, number] = [
    Number.MAX_SAFE_INTEGER,
    Number.MIN_SAFE_INTEGER,
  ];
  const y: [number, number] = [
    Number.MAX_SAFE_INTEGER,
    Number.MIN_SAFE_INTEGER,
  ];
  const points = new Set<string>();
  s.split("\n").forEach((l, i) => {
    for (let ix = 0; ix < l.length; ix++) {
      if (l[ix] == "#") {
        points.add([i, ix].join());
        x[0] = Math.min(x[0], i);
        x[1] = Math.max(x[1], i);
        y[0] = Math.min(y[0], ix);
        y[1] = Math.max(y[1], ix);
      }
    }
  });
  return { borders: { x, y }, points, default: "." };
}

function transpose(img: Image, alg: string): Image {
  const x: [number, number] = [img.borders.x[0] - 1, img.borders.x[1] + 1];
  const y: [number, number] = [img.borders.y[0] - 1, img.borders.y[1] + 1];
  const points = new Set<string>();
  for (let xO = img.borders.x[0] - 1; xO < img.borders.x[1] + 2; xO++) {
    for (let yO = img.borders.y[0] - 1; yO < img.borders.y[1] + 2; yO++) {
      let s = "";
      for (let dx = xO - 1; dx < xO + 2; dx++) {
        for (let dy = yO - 1; dy < yO + 2; dy++) {
          if (
            dx < img.borders.x[0] ||
            dy < img.borders.y[0] ||
            dx > img.borders.x[1] ||
            dy > img.borders.y[1]
          ) {
            s += img.default === "#" ? "1" : "0";
          } else {
            s += img.points.has([dx, dy].join()) ? "1" : "0";
          }
        }
      }
      const idx = Number.parseInt(s, 2);
      if (alg[idx] == "#") {
        points.add([xO, yO].join());
      }
    }
  }
  return {
    points,
    borders: { x, y },
    default:
      alg[Number.parseInt("".padStart(9, img.default === "#" ? "1" : "0"), 2)],
  };
}

function display(img: Image) {
  const dig = Array.from({
    length: img.borders.x[1] - img.borders.x[0] + 1,
  }).map(() => Array.from({ length: img.borders.y[1] - img.borders.y[0] + 1 }));
  img.points.forEach((val) => {
    const [x, y] = val.split(",").map((n) => Number.parseInt(n));
    dig[x - img.borders.x[0]][y - img.borders.y[0]] = "#";
  });
  console.log(dig.map((d) => d.map((p) => p ?? ".").join("")).join("\n"));
}

function solve(times: number) {
  return (arr: Array<string | Image>) => {
    const alg = arr[0] as string;
    let img = arr[1] as Image;
    for (let i = 0; i < times; i++) {
      img = transpose(img, alg);
    }
    return img.points.size;
  };
}

const task = new Solution(solve(2), solve(50), {
  sep: "\n\n",
  transform: (a, i) => (i == 0 ? a : imageFromString(a)),
});
task.expect(35, 3351);

export default task;
