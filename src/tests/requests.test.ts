import { test, expect } from "vitest";

import { httpGet, httpPost } from "../http/request";
import { setConfig } from "../core/config";
import type { todo } from "./types.test";

const testConfig = () => {
  setConfig({
    APIs: {
      Main: {
        baseUrl: "https://jsonplaceholder.typicode.com",
      },
    },
    lang: "en",
  });
};

test("httpGet request test", async () => {
  testConfig();
  const resp: todo = {
    userId: 1,
    id: 1,
    title: "delectus aut autem",
    completed: false,
  };
  expect(await httpGet<todo>("Main", "/todos/1")).toStrictEqual(resp);
});

test("httpGet request test fail", async () => {
  testConfig();
  expect(await httpGet<string>("Main", "/err/404")).toBeNull();
});

test("httpPost test", async () => {
  testConfig();

  const body = {
    userId: 1,
    id: 1,
    title: "TEST TITLE",
    body: "SHKEBEDE",
  };

  expect(await httpPost<{ id: number }>("Main", "/posts", { body })).toStrictEqual({ id: 101 });
});
