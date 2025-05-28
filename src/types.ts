import { getConfig } from "./core/config";

// Global types
const APIs = getConfig().APIs;
export type apiType = keyof typeof APIs;

// Request types
export type methodType =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS";

export type bodyType = Record<string, any>;

export type headersType = Record<string, string>;

export type optionsType = {
  body?: bodyType;
  xsrf?: boolean;
  signal?: AbortSignal | null;
  hooks?: ShapeRQHooks;
};

// Config types
export type authType = {
  token: string | null;
  headerName?: string;
  prefix?: string;
};

export type OnErrorParams = {
  error: unknown;
  retry: () => Promise<unknown>;
  endpoint?: string;
  method?: methodType;
  status?: number;
  aborted?: boolean;
  isNetworkError?: boolean;
};

export type ShapeRQHooks = {
  onError?: (params: OnErrorParams) => Promise<unknown | null> | unknown | null;
  onRequest?: () => void;
  onResponse?: <T>(data: T) => void;
};

export interface ShapeRQConfig {
  APIs: Record<string, string>;
  auth?: authType | Record<string, authType>;
  headers?: Record<string, string>;
  debug?: boolean;
  lang?: "ru" | "en";
}

// Logger types
export type httpData = {
  method: string;
  url: string;
  body?: any;
};

export type iStyles = {
  title: string;
  message: string;
  separator?: string;
  body?: string;
  doc?: string;
};

export type iSimpleStyles = {
  info: string;
  success: string;
  warn: string;
  error: string;
};
