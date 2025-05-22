import { getConfig } from "../core/config";

export type method =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS";

export type body = Record<string, any>;

export type headers = Record<string, string>;

const APIs = getConfig().APIs;
export type api = keyof typeof APIs;
