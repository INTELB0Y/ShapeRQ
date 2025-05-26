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
  headers?: Record<string, string>;
  debug?: boolean;
  retry?: {
    attempts: number;
    time: number;
    error: number;
  };
  lang: "ru" | "en";
}

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
