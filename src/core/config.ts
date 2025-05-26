import { ShapeRQConfig } from "../types";

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
    retry: {
      attempts: userConfig.retry?.attempts ?? config.retry?.attempts ?? 0,
      time: userConfig.retry?.time ?? config.retry?.time ?? 0,
      error: userConfig.retry?.error ?? config.retry?.error ?? 0,
    },
    lang: userConfig.lang || config.lang,
  };
}

export function getConfig(): ShapeRQConfig {
  return config;
}
