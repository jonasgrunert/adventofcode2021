import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts";
import { readFileToArray } from "./_util.ts";
import { task1, task2 } from "./02.ts";

Deno.test("02 - Task 1", async () => {
  const arr = await readFileToArray((val) => {
    const [i, n] = val.split(" ");
    return { i, n: Number(n) };
  });
  assertEquals(task1(arr), 150);
});

Deno.test("02 - Task 2", async () => {
  const arr = await readFileToArray((val) => {
    const [i, n] = val.split(" ");
    return { i, n: Number(n) };
  });
  assertEquals(task2(arr), 900);
});
