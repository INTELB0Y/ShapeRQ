import {
  methodType,
  headersType,
  apiType,
  optionsType,
  authType,
} from "../types";
import { getConfig } from "../core/config";
import {
  logWarn,
  logInfo,
  httpErrLog,
  httpDataLog,
  httpSuccessLog,
  NetworkErrLog,
  systemHttpLog,
  logError,
} from "../utils/logger/logger";
import { t } from "../locales/i18";
import { getXsrfToken } from "./xsrfProtection";

/**
 * request - Function for sending requests to the API;
 * @param method - request method, GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS
 * @param api - API from config
 * @param endpoint - API endpoint
 * @param options - options for the request, contain body and signal
 */
async function request<T>(
  method: methodType,
  api: apiType,
  endpoint?: string,
  options?: optionsType,
): Promise<T | null> {
  const { APIs, auth, debug } = getConfig();
  const url = APIs[api] + (endpoint || "");
  const safeMethods: methodType[] = ["GET", "HEAD", "OPTIONS"];

  const headers: headersType = {
    "content-type": "application/json",
  };

  // --- AUTH HEADER ---
  if (auth) {
    const global = typeof auth === "object" && "token" in auth;
    const scoped =
      typeof auth === "object" &&
      !("token" in auth) &&
      (auth as Record<string, authType>)[api];

    if (global) {
      headers[String(auth.headerName || "Authorization")] =
        `${auth.prefix || "Bearer"} ${auth.token}`;
    } else if (scoped) {
      headers[String(auth[api].headerName || "Authorization")] =
        `${auth[api].prefix || "Bearer"} ${auth[api].token}`;
    }
  }

  // --- XSRF ---
  if (!safeMethods.includes(method) && options?.xsrf !== false) {
    const token = getXsrfToken();
    if (!token) {
      debug && logWarn(t("Base:debug.xsrf"));
      return null;
    }
    headers["X-CSRFToken"] = token;
  }

  // --- onRequest hook ---
  try {
    options?.hooks?.onRequest?.();
  } catch (e) {
    debug && logWarn("onRequest threw error: " + (e as Error).message);
  }

  // --- FETCH ---
  try {
    debug && logInfo(t("Base:info.start"));
    const response = await fetch(url, {
      method,
      headers,
      body: !["GET", "DELETE", "HEAD", "OPTIONS"].includes(method)
        ? JSON.stringify(options?.body)
        : null,
      signal: options?.signal,
    });

    if (response.ok) {
      const data = !["HEAD", "OPTIONS"].includes(method)
        ? ((await response.json()) as T)
        : null;

      // --- Logs ---
      if (debug) {
        logInfo(t("Base:info.complete"));
        if (["HEAD", "OPTIONS"].includes(method)) {
          systemHttpLog(response, method, url);
        } else {
          httpSuccessLog({ url, method, body: options?.body });
          data ? httpDataLog(data) : logWarn(t("Base:debug.empty"));
        }
      }

      // --- onResponse hook ---
      options?.hooks?.onResponse?.(data as T);

      return data;
    } else {
      debug && httpErrLog(response.status);
      throw response;
    }
  } catch (err: any) {
    if (debug) {
      if (err instanceof Error && err.name === "AbortError") {
        logError(`${t("Base:debug.abort")}`);
      } else if (!(err instanceof Response)) {
        NetworkErrLog();
      }
    }

    // --- onError hook ---
    try {
      const retry = () => request<T>(method, api, endpoint, options);

      const result = await options?.hooks?.onError?.({
        error: err,
        retry,
        endpoint,
        method,
        status: err instanceof Response ? err.status : undefined,
        aborted: err instanceof Error && err.name === "AbortError",
        isNetworkError: !(err instanceof Response),
      });

      if (result) return result as T;
    } catch (hookErr) {
      debug && logWarn("onError threw error: " + (hookErr as Error).message);
    }

    return null;
  }
}

/**
 * httpGet - Function for sending GET request;
 * @param api - API from config
 * @param endpoint - API endpoint
 * @param options - Request options, can contain body and signal
 */
export const httpGet = (
  api: apiType,
  endpoint: string,
  options?: optionsType,
) => request("GET", api, endpoint, options);

/**
 * httpDel - Function for sending DELETE request;
 * @param api - API from config
 * @param endpoint - API endpoint
 * @param options - Request options, can contain body and signal
 */
export const httpDel = (
  api: apiType,
  endpoint: string,
  options?: optionsType,
) => request("DELETE", api, endpoint, options);
/**
 * httpHead - Function for sending HEAD request;
 * @param api - API from config
 * @param endpoint - API endpoint
 * @param options - Request options, can contain body and signal
 */
export const httpHead = (
  api: apiType,
  endpoint: string,
  options?: optionsType,
) => request("HEAD", api, endpoint, options);
/**
 * httpOpt - Function for sending OPTIONS request;
 * @param api - API from config
 * @param endpoint - API endpoint
 * @param options - Request options, can contain body and signal
 */
export const httpOpt = (
  api: apiType,
  endpoint: string,
  options?: optionsType,
) => request("OPTIONS", api, endpoint, options);
/**
 * httpPost - Function for sending POST request;
 * @param api - API from config
 * @param endpoint - API endpoint
 * @param options - Request options, can contain body and signal
 */
export const httpPost = (
  api: apiType,
  endpoint: string,
  options?: optionsType,
) => request("POST", api, endpoint, options);
/**
 * httpPut - Function for sending PUT request;
 * @param api - API from config
 * @param endpoint - API endpoint
 * @param options - Request options, can contain body and signal
 */
export const httpPut = (
  api: apiType,
  endpoint: string,
  options?: optionsType,
) => request("PUT", api, endpoint, options);

/**
 * httpPatch - Function for sending PATCH request;
 * @param api - API from config
 * @param endpoint - API endpoint
 * @param options - Request options, can contain body and signal
 */
export const httpPatch = (
  api: apiType,
  endpoint: string,
  options?: optionsType,
) => request("PATCH", api, endpoint, options);
