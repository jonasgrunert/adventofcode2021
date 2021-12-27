import Solution from "./_util.ts";

function rot(d0: number, d1: number) {
  const div = d0 / d1;
  return Math.abs(div) === 1 ? div : 0;
}

class Signal {
  x: number;
  y: number;
  z: number;
  id: number;
  relatives: string[] = [];

  constructor(x: number, y: number, z: number, id: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.id = id;
  }

  align(signal: Signal) {
    const dx = Math.abs(this.x - signal.x);
    const dy = Math.abs(this.y - signal.y);
    const dz = Math.abs(this.z - signal.z);
    this.relatives[signal.id] = signal.relatives[this.id] = [
      Math.hypot(dx, dy, dz).toFixed(5),
      Math.min(dx, dy, dz),
      Math.max(dx, dy, dz),
    ].join(",");
  }

  compare(signal: Signal) {
    return this.relatives
      .map((r) => {
        const idx = signal.relatives.indexOf(r);
        return idx === -1
          ? false
          : [signal.relatives[idx], this.relatives.indexOf(r), idx];
      })
      .filter(Boolean) as [string, number, number][];
  }
}

class Scanner {
  signals: Signal[] = [];
  position?: { x: number; y: number; z: number };

  constructor(s: string) {
    s.split("\n")
      .slice(1)
      .map((p) => this.#addSignal(p.split(",").map((n) => Number.parseInt(n))));
  }

  #addSignal([x, y, z]: number[]) {
    const newSignal = new Signal(x, y, z, this.signals.length);
    this.signals.forEach((signal) => signal.align(newSignal));
    this.signals.push(newSignal);
  }

  compare(scanner: Scanner) {
    for (const there of scanner.signals) {
      for (const here of this.signals) {
        const intersection = there.compare(here);
        if (intersection.length >= 11) {
          return { there, here, intersection };
        }
      }
    }
  }

  align(scanner: Scanner, data: NonNullable<ReturnType<Scanner["compare"]>>) {
    for (const line of data.intersection) {
      if (line[0].split(",")[1] === "0") continue;
      const relativeHere = this.signals[line[2]];
      const dx0 = data.here.x - relativeHere.x;
      const dy0 = data.here.y - relativeHere.y;
      const dz0 = data.here.z - relativeHere.z;

      const relativeThere = scanner.signals[line[1]];
      const dx1 = data.there.x - relativeThere.x;
      const dy1 = data.there.y - relativeThere.y;
      const dz1 = data.there.z - relativeThere.z;
      if (
        Math.abs(dx0) === Math.abs(dy0) ||
        Math.abs(dz0) === Math.abs(dy0) ||
        Math.abs(dx0) === Math.abs(dz0)
      )
        continue;

      for (const signal of scanner.signals) {
        const old = {
          x: signal.x,
          y: signal.y,
          z: signal.z,
        };
        signal.x =
          old.x * rot(dx0, dx1) + old.y * rot(dx0, dy1) + old.z * rot(dx0, dz1);
        signal.y =
          old.x * rot(dy0, dx1) + old.y * rot(dy0, dy1) + old.z * rot(dy0, dz1);
        signal.z =
          old.x * rot(dz0, dx1) + old.y * rot(dz0, dy1) + old.z * rot(dz0, dz1);
      }
      scanner.position = {
        x: data.here.x - data.there.x,
        y: data.here.y - data.there.y,
        z: data.here.z - data.there.z,
      };
      for (const signal of scanner.signals) {
        signal.x += scanner.position.x;
        signal.y += scanner.position.y;
        signal.z += scanner.position.z;
      }
      break;
    }
  }
}
const task = new Solution(
  (arr: Scanner[]) => {
    const locked = new Set([0]);
    arr[0].position = { x: 0, y: 0, z: 0 };
    while (locked.size < arr.length) {
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
          if (i === j || !locked.has(i) || locked.has(j)) continue;
          const intersection = arr[i].compare(arr[j]);
          if (intersection) {
            arr[i].align(arr[j], intersection);
            locked.add(j);
          }
        }
      }
    }
    const beacons = new Set();
    for (const scanner of arr)
      for (const signal of scanner.signals)
        beacons.add([signal.x, signal.y, signal.z].join(","));
    return beacons.size;
  },
  (arr: Scanner[]) => {
    const locked = new Set([0]);
    arr[0].position = { x: 0, y: 0, z: 0 };
    while (locked.size < arr.length) {
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
          if (i === j || !locked.has(i) || locked.has(j)) continue;
          const intersection = arr[i].compare(arr[j]);
          if (intersection) {
            arr[i].align(arr[j], intersection);
            locked.add(j);
          }
        }
      }
    }
    const beacons = new Set<string>();
    for (const scanner of arr)
      for (const signal of scanner.signals)
        beacons.add([signal.x, signal.y, signal.z].join(","));
    return arr
      .flatMap((c, i, a) => a.slice(i).map((p) => [p, c] as [Scanner, Scanner]))
      .reduce((p, [h, t]) => {
        return Math.max(
          p,
          Math.abs(h.position!.x - t.position!.x) +
            Math.abs(h.position!.y - t.position!.y) +
            Math.abs(h.position!.z - t.position!.z)
        );
      }, 0);
  },
  { sep: "\n\n", transform: (a) => new Scanner(a) }
);
task.expect(79, 3621);

if (import.meta.main) await task.execute();

export default task;
