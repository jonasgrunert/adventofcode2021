import Solution from "./_util.ts";

type Packet = {
  version: number;
  typeId: number;
  subPackets: Packet[];
  value: number;
};

class Reader {
  #cursor = 0;
  #string: string;
  #stamp = [0];

  constructor(s: string) {
    this.#string = s
      .split("")
      .map((n) => Number.parseInt(n, 16).toString(2).padStart(4, "0"))
      .join("");
  }

  take(n = 1) {
    this.#cursor += n;
    return this.#string.slice(this.#cursor - n, this.#cursor);
  }

  isEoL() {
    return this.#cursor > this.#string.length;
  }

  get cursor() {
    return this.#cursor;
  }

  stamp() {
    this.#stamp.push(this.#cursor);
  }

  since() {
    return this.#cursor - this.#stamp[this.#stamp.length - 1];
  }

  pop() {
    this.#stamp.pop();
  }
}

function parsePacket(
  reader: Reader,
  opts: { type: "0"; subLength: number } | { type: "1"; subPackets: number } = {
    type: "1",
    subPackets: 1,
  }
) {
  const p: Packet[] = [];
  if (opts.type === "0") reader.stamp();
  while (
    (opts.type === "0"
      ? reader.since() < opts.subLength
      : p.length < opts.subPackets) &&
    !reader.isEoL()
  ) {
    const version = Number.parseInt(reader.take(3), 2);
    const typeId = Number.parseInt(reader.take(3), 2);
    switch (typeId) {
      case 4: {
        let value = "";
        while (reader.take() === "1") {
          value += reader.take(4);
        }
        value += reader.take(4);
        p.push({
          version,
          typeId,
          value: Number.parseInt(value, 2),
          subPackets: [],
        });
        break;
      }
      default: {
        let packets: Packet[] = [];
        switch (reader.take()) {
          case "0": {
            packets = parsePacket(reader, {
              type: "0",
              subLength: Number.parseInt(reader.take(15), 2),
            });
            break;
          }
          case "1": {
            packets = parsePacket(reader, {
              type: "1",
              subPackets: Number.parseInt(reader.take(11), 2),
            });
            break;
          }
        }
        let value = 0;
        switch (typeId) {
          case 0: {
            value = packets.reduce((p, c) => p + c.value, 0);
            break;
          }
          case 1: {
            value = packets.reduce((p, c) => p * c.value, 1);
            break;
          }
          case 2: {
            value = Math.min(...packets.map((c) => c.value));
            break;
          }
          case 3: {
            value = Math.max(...packets.map((c) => c.value));
            break;
          }
          case 5: {
            value = packets[0].value > packets[1].value ? 1 : 0;
            break;
          }
          case 6: {
            value = packets[0].value < packets[1].value ? 1 : 0;
            break;
          }
          case 7: {
            value = packets[0].value === packets[1].value ? 1 : 0;
            break;
          }
        }
        p.push({ version, typeId, subPackets: packets, value });
        break;
      }
    }
  }
  if (opts.type === "0") reader.pop();
  return p;
}

const task = new Solution(
  (arr: Reader[]) => {
    const r = parsePacket(arr[0])[0];
    const sum = (r: Packet): number =>
      r.typeId === 4
        ? r.version
        : r.version + r.subPackets!.reduce((p, c) => p + sum(c), 0);
    return sum(r);
  },
  (arr: Reader[]) => {
    const r = parsePacket(arr[0]);
    return r[0].value;
  },
  {
    transform: (a) => new Reader(a),
  }
);
task.expect(31, 54);

if (import.meta.main) await task.execute();

export default task;
