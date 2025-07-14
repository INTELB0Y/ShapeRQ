import { expect, describe, it } from "vitest";

import { httpGet } from "../http/request";
import { setConfig } from "../core/config";
import type { todo } from "./test-types";
import type { iShapeRQHooks } from "../types";

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
});
