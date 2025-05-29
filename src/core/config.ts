import type { ShapeRQConfig } from "../types";

let config: ShapeRQConfig = {
  APIs: {},
  debug: false,
  lang: "en",
};

/**
 * setConfig - Function for setting configuration
 * @param userConfig - Your configuration
 */

export function setConfig(userConfig: Partial<ShapeRQConfig>) {
  config = {
    ...config,
    ...userConfig,
    APIs: {
      ...config.APIs,
      ...userConfig.APIs,
    },
    auth: {
      ...config.auth,
      ...userConfig.auth,
    },
    headers: {
      ...config.headers,
      ...userConfig.headers,
    },
    lang: userConfig.lang || config.lang,
  };
}

export function getConfig(): ShapeRQConfig {
  return config;
}
