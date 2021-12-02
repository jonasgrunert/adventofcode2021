export function readFileToArray<O>(
  transform: (value: string, index: number, array: string[]) => O = (data) =>
    <O>(<unknown>data),
  sep = "\n"
): Promise<O[]> {
  const url = Deno.mainModule.replace(
    /(\d{2}(?:_test)?).ts/,
    (_, d) => `data/${d}.txt`
  );
  console.log(url);
  return Deno.readTextFile(new URL(url)).then((s) =>
    s.split(sep).map(transform)
  );
}

let i = 1;

export function solution(sol: unknown) {
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
