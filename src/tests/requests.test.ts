import { expect, describe, it } from "vitest";

import { httpGet, httpPost } from "../http/request";
import { setConfig } from "../core/config";
import type { todo } from "./test-types";

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
    const resp: todo = {
      userId: 1,
      id: 1,
      title: "delectus aut autem",
      completed: false,
    };
    expect(await httpGet<todo>("Main", "/todos/1")).toStrictEqual(resp);
  });

  it("httpGet request fails", async () => {
    expect(await httpGet<todo>("Main", "/error/404")).toBeNull();
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
});
