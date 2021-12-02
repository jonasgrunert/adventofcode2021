import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts";
import { getNumber } from "./_util.ts";
import sol from "./01.ts";

Deno.test(`${getNumber()} - Task 1`, async () => {
  const res = await sol.result1;
  assertEquals(res, 7);
});

Deno.test(`${getNumber()} - Task 2`, async () => {
  const res = await sol.result2;
  assertEquals(res, 5);
});
