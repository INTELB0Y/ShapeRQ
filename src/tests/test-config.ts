import { createConfig } from "../core/config";

const testCfg = () => {
  createConfig({
    APIs: {
      Main: {
        baseUrl: "https://jsonplaceholder.typicode.com",
      },
    },
    lang: "en",
  });
};

export default testCfg;
