import { expect, describe, it } from "vitest";

import { httpDel, httpGet, httpPost } from "../http/request";
import type { testTodo } from "./test-types";
import testCfg from "./test-config";
import type { iShapeRQHooks } from "../types";

describe("ShapeRQ requests tests", () => {
  testCfg();

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

    expect(await httpPost<testTodo>("Main", "/posts", { body })).toStrictEqual({
      userId: 1,
      id: 101,
      title: "TEST TITLE",
      body: "SHKEBEDE",
    });
  });

  it("httpDel test", async () => {
    expect(await httpDel<{}>("Main", "/posts/1")).toStrictEqual({});
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
