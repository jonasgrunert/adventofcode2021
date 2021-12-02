function readFileToArray<O>(
  transform: (value: string, index: number, array: string[]) => O = (data) =>
    <O>(<unknown>data),
  sep: string | RegExp = "\n"
): Promise<O[]> {
  const url = Deno.mainModule.replace(
    /(\d{2}(?:_test)?).ts/,
    (_, d) => `data/${d}.txt`
  );
  return Deno.readTextFile(new URL(url)).then((s) =>
    s.split(sep).map(transform)
  );
}

let i = 1;

function solution(sol: unknown) {
  const parts = Deno.mainModule.match(/\/(?<num>\d{2})\.ts/);
  if (parts) {
    console.log(
      `${parts.groups?.num ?? "Unkown"} - ${i}: ${Deno.inspect(sol)}`
    );
    i++;
  }
}

if (import.meta.main) {
  for await (const dir of Deno.readDir(".")) {
    if (dir.isFile && dir.name.match(/\d{2}\.ts/)) {
      const proc = Deno.run({
        cmd: ["deno", "run", "--allow-read", `./${dir.name}`],
      });
      await proc.status();
    }
  }
}

const DefaultImplementation = () => {
  throw new Error("Not implemented");
};

type TaskFunction<T, O> = (data: T[]) => O;
type ReadOpts<T> = {
  transform?: (value: string, index: number, array: string[]) => T;
  sep?: string | RegExp;
};

class Solution<T, O1, O2 = O1> {
  readonly #t1: TaskFunction<T, O1>;
  readonly #t2: TaskFunction<T, O2>;
  readonly #opts: ReadOpts<T>;
  constructor(
    task1: TaskFunction<T, O1>,
    task2: TaskFunction<T, O2> | ReadOpts<T>,
    opts: ReadOpts<T> = {
      transform: (data) => <T>(<unknown>data),
      sep: "\n",
    }
  ) {
    this.#t1 = task1;
    if (typeof task2 === "function") {
      this.#t2 = task2;
      this.#opts = opts;
    } else {
      this.#t2 = DefaultImplementation;
      this.#opts = task2;
    }
  }

  get result1() {
    return readFileToArray(this.#opts.transform, this.#opts.sep).then((d) =>
      this.#t1(d)
    );
  }

  get result2() {
    return readFileToArray(this.#opts.transform, this.#opts.sep).then((d) =>
      this.#t2(d)
    );
  }

  async execute() {
    solution(await this.result1);
    solution(await this.result2);
  }
}

export default Solution;
export function getNumber(): number {
  return Number(
    Deno.mainModule.match(/(?<num>\d{2})_test.ts/)?.groups?.num ?? 0
  );
}
