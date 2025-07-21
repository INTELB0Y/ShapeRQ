import { getConfig } from "./core/config";

// Global types
const APIs = getConfig().APIs;
export type apiType = keyof typeof APIs;

// Request types
export type methodType = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";

export type bodyType = Record<string, unknown> | FormData | string;

export type headersType = Record<string, string>;

// type cacheOptionsType =
//   | {
//       ttl: number;
//     }
//   | true;

/**
 * @typeParam `body` - Request body can be an object, FormData, or string
 * @typeParam `headers` - Optional headers for the request
 * @typeParam `xsrf` - Enable XSRF protection, default is true
 * @typeParam `signal` - AbortSignal for request cancellation
 * @typeParam `hooks` - Optional hooks for request lifecycle events
 */
export type optionsType = {
  hooks?: iShapeRQHooks;
  xsrf?: boolean;
  cache?: true | number;

  signal?: AbortSignal;
  mode?: RequestMode;
  credentials?: RequestCredentials;

  body?: bodyType;
  headers?: headersType;
};

// Config types
/**
 * @typeParam `token` - Authorization token, can be null if not authenticated
 * @typeParam `headerName` - Name of the header for the token, default is "Authorization"
 * @typeParam `prefix` - Prefix for the token, default is "Bearer"
 */
export type authType = {
  token: () => string | null;
  headerName?: string;
  prefix?: string;
};

export type onErrorParams = {
  error: unknown;
  retry: () => Promise<unknown>;
  endpoint?: string;
  method?: methodType;
  status?: number;
  aborted?: boolean;
  isNetworkError?: boolean;
};

type onRequestParams = {
  url: string;
  cacheDel: (url: string) => void;
  headers?: headersType;
  body?: bodyType;
};

export interface iShapeRQHooks {
  onError?: (params: onErrorParams) => Promise<unknown | null> | unknown | null;
  onRequest?: (params: onRequestParams) => void;
  onResponse?: <T>(data: T) => void;
}

/**
 * @typeParam `baseUrl` - Base URL for the API
 * @typeParam `headers` - Optional headers for the API requests
 * @typeParam `auth` - Optional authentication configuration
 */
export type ApiConfigType = {
  baseUrl: string;
  headers?: headersType;
  auth?: authType;
};

/**
 * @typeParam `APIs` - Record of API names and their configurations
 * @typeParam `debug` - Enable debug mode, default is false
 * @typeParam `lang` - Language for messages, default is "en", can be "ru" or "en"
 */
export interface iShapeRQConfig {
  APIs: Record<string, ApiConfigType>;
  debug?: boolean;
  lang?: "ru" | "en";
}

// Logger types
export type httpDataType = {
  method: string;
  url: string;
  body?: any;
};

export type StylesType = {
  title: string;
  message: string;
  separator?: string;
  body?: string;
  doc?: string;
};

export type SimpleStylesType = {
  info: string;
  warn: string;
  error: string;
};
