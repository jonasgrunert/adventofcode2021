import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts";
import { readFileToArray } from "./_util.ts";
import { task1, task2 } from "./01.ts";

Deno.test("Task 1", async () => {
  const arr = await readFileToArray(Number);
  assertEquals(task1(arr), 7);
});

Deno.test("Task 2", async () => {
  const arr = await readFileToArray(Number);
  assertEquals(task2(arr), 5);
});
