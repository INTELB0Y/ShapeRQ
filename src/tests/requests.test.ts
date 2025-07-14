import { expect, describe, it } from "vitest";

import { httpGet, httpPost } from "../http/request";
import { setConfig } from "../core/config";
import type { testTodo } from "./test-types";
import type { iShapeRQHooks } from "../types";

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

describe("ShapeRQ requests tests", () => {
  testConfig();

  it("httpGet request test", async () => {
    const resp: testTodo = {
      userId: 1,
      id: 1,
      title: "delectus aut autem",
      completed: false,
    };
    expect(await httpGet<testTodo>("Main", "/todos/1")).toStrictEqual(resp);
  });

  it("httpGet request fails", async () => {
    expect(await httpGet<testTodo>("Main", "/error/404")).toBeNull();
  });

  it("httpPost test", async () => {
    const body = {
      userId: 1,
      id: 1,
      title: "TEST TITLE",
      body: "SHKEBEDE",
    };

    expect(await httpPost<{ id: number }>("Main", "/posts", { body })).toStrictEqual({ id: 101 });
  });

  it("httpGet retry test", async () => {
    let retryCount = 0;
    const hook: iShapeRQHooks = {
      onError: async ({ retry }) => {
        if (retryCount < 2) {
          retryCount++;
          return await retry();
        }
      },
    };
    expect(await httpGet<testTodo>("Main", "/todos/0", { hooks: hook })).toStrictEqual(null);
  });
});
