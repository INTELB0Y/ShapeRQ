/**
 * APIs - Dictionary of your API urls
 * auth - Request authorization parameters:
 * - token - Auth token
 * - headerName - headerName, 'Authorization' default
 * - prefix - Token prefix, 'Bearer' default
 */

export interface ShapeRQConfig {
  APIs: Record<string, string>;
  auth?: {
    token?: string;
    headerName?: string;
    prefix?: string;
  };
  debug?: boolean;
  headers?: Record<string, string>;
  lang: "ru" | "en";
}

let config: ShapeRQConfig = {
  APIs: {},
  debug: true,
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
