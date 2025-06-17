import type { iShapeRQConfig } from "../types";

let config: iShapeRQConfig = {
  APIs: {},
  lang: "en",
};

/**
 * setConfig - Function for setting configuration
 * @param userConfig - Your configuration as @iShapeRQConfig
 * @see {@link iShapeRQConfig}
 */

export function setConfig(userConfig: Partial<iShapeRQConfig>) {
  config = {
    ...config,
    ...userConfig,
    APIs: {
      ...config.APIs,
      ...userConfig.APIs,
    },
    lang: userConfig.lang || config.lang,
  };
}

export function getConfig(): iShapeRQConfig {
  return config;
}
