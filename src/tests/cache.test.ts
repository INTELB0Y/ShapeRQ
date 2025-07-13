import { expect, describe, it } from "vitest";

import { httpGet, httpPost } from "../http/request";
import { setConfig } from "../core/config";
import type { todo } from "./test-types";
import { iShapeRQHooks } from "../types";

const testConfig = () => {
  setConfig({
    APIs: {
      Main: {
        baseUrl: "https://jsonplaceholder.typicode.com",
      },
    },
    lang: "en",
    debug: true,
  });
};

describe("ShapeRQ cache tests", () => {
  testConfig();

  it("httpGet cache test", async () => {
    const resp: todo = {
      userId: 1,
      id: 1,
      title: "delectus aut autem",
      completed: false,
    };
    await httpGet<todo>("Main", "/todos/1", { cache: true });
    expect(await httpGet<todo>("Main", "/todos/1", { cache: { ttl: 1000 } })).toStrictEqual(resp);
  });

  it("httpGet delete cache test", async () => {
    const resp: todo = {
      userId: 1,
      id: 1,
      title: "delectus aut autem",
      completed: false,
    };
    const hook: iShapeRQHooks = {
      onRequest: ({ url, cacheDel }) => {
        cacheDel(url);
      },
    };
    await httpGet<todo>("Main", "/todos/1", { cache: true });
    expect(
      await httpGet<todo>("Main", "/todos/1", { hooks: hook, cache: { ttl: 1000 } }),
    ).toStrictEqual(resp);
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
    expect(await httpGet<todo>("Main", "/todos/0", { hooks: hook })).toStrictEqual(null);
  });
});
