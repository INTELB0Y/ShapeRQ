import type { methodType, headersType, apiType, optionsType } from "../types";
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
 * Function for sending requests to the API;
 * @param `method` - request method, GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS
 * @param `api` - API from config
 * @param `endpoint` - API endpoint
 * @param `options` - options for the request, contain body, headers, xsrf, signal, hooks
 */
async function request<T>(
  method: methodType,
  api: apiType,
  endpoint?: string,
  options?: optionsType,
): Promise<T | null> {
  // --- Config ---
  const { APIs, debug } = getConfig();
  const auth = APIs[api].auth;
  const url = APIs[api].url + (endpoint || "");

  // --- Validation ---
  const safeMethods: methodType[] = ["GET", "HEAD", "OPTIONS"];
  const body =
    options?.body instanceof FormData
      ? options?.body
      : JSON.stringify(options?.body);
  const contentType =
    options?.body instanceof FormData
      ? "multipart/form-data"
      : "application/json";

  // --- REQUEST HEADERS ---
  const headers: headersType = {
    ...options?.headers,
    ...APIs[api].headers,
    contentType,
  };

  // --- AUTH HEADER ---
  if (auth?.token()) {
    headers[String(auth.headerName || "Authorization")] =
      `${auth.prefix || "Bearer"} ${auth.token()}`;
  }

  // --- XSRF ---
  if (!safeMethods.includes(method) && options?.xsrf !== false) {
    const token: string | null = getXsrfToken();
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
        ? body
        : null,
      signal: options?.signal,
    });

    if (response.ok) {
      const data = !["HEAD", "OPTIONS"].includes(method)
        ? ((await response.json()) as T)
        : null;

      // --- LOGS ---
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
      // noinspection ExceptionCaughtLocallyJS
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
 * Wrapper for request with GET method. See {@link request} for details.
 */
export const httpGet = <T>(
  api: apiType,
  endpoint: string,
  options?: optionsType,
) => request<T>("GET", api, endpoint, options);

/**
 * Wrapper for request with DELETE method. See {@link request} for details.
 */
export const httpDel = <T>(
  api: apiType,
  endpoint: string,
  options?: optionsType,
) => request<T>("DELETE", api, endpoint, options);

/**
 * Wrapper for request with HEAD method. See {@link request} for details.
 */
export const httpHead = <T>(
  api: apiType,
  endpoint: string,
  options?: optionsType,
) => request<T>("HEAD", api, endpoint, options);

/**
 * Wrapper for request with OPTIONS method. See {@link request} for details.
 */
export const httpOpt = <T>(
  api: apiType,
  endpoint: string,
  options?: optionsType,
) => request<T>("OPTIONS", api, endpoint, options);

/**
 * Wrapper for request with POST method. See {@link request} for details.
 */
export const httpPost = <T>(
  api: apiType,
  endpoint: string,
  options?: optionsType,
) => request<T>("POST", api, endpoint, options);
/**
 * Wrapper for request with PUT method. See {@link request} for details.
 */
export const httpPut = <T>(
  api: apiType,
  endpoint: string,
  options?: optionsType,
) => request<T>("PUT", api, endpoint, options);

/**
 * Wrapper for request with PATCH method. See {@link request} for details.
 */
export const httpPatch = <T>(
  api: apiType,
  endpoint: string,
  options?: optionsType,
) => request<T>("PATCH", api, endpoint, options);
