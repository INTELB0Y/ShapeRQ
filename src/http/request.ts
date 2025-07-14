import type { methodType, headersType, apiType, optionsType } from "../types";
import { getConfig } from "../core/config";
import {
  _logWarn,
  _logInfo,
  _httpErrLog,
  httpDataLog,
  _httpSuccessLog,
  _NetworkErrLog,
  _systemHttpLog,
  _logError,
  _cacheDataLog,
  _cacheSuccessLog,
} from "../utils/logger/logger";
import { t } from "../locales/i18";
import { getXsrfToken } from "./xsrfProtection";
import { cacheDel, inMemory } from "../utils/cache/cache";

/**
 * Function for sending requests to the API;
 * @param `method` - request method, GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS
 * @param `api` - API from config
 * @param `endpoint` - API endpoint
 * @param `options` - options for the request, contain body, headers, xsrf, signal, hooks
 * @internal
 */
async function _request<T>(
  method: methodType,
  api: apiType,
  endpoint?: string,
  options?: optionsType,
): Promise<T | null> {
  // --- Config ---
  const { APIs, debug } = getConfig();
  const auth = APIs[api]?.auth;
  const url = APIs[api]?.baseUrl + (endpoint || "");

  // --- Validation ---
  const safeMethods: methodType[] = ["GET", "HEAD", "OPTIONS"];
  const body = options?.body instanceof FormData ? options?.body : JSON.stringify(options?.body);
  const contentType =
    options?.body instanceof FormData ? "multipart/form-data" : "application/json";

  // --- REQUEST HEADERS ---
  const headers: headersType = {
    ...options?.headers,
    ...APIs[api]?.headers,
    contentType,
  };

  // --- AUTH HEADER ---
  if (auth?.token()) {
    headers[String(auth.headerName || "Authorization")] =
      `${auth.prefix || "Bearer"} ${auth.token()}`;
  }

  // --- XSRF ---
  if (!safeMethods.includes(method) && options?.xsrf !== false) {
    if (typeof document !== "undefined") {
      const token: string | null = getXsrfToken();
      if (!token) {
        debug && _logWarn(t("Base:debug.xsrf"));
        return null;
      }
      headers["X-CSRFToken"] = token;
    }
  }

  // --- onRequest hook ---
  try {
    options?.hooks?.onRequest?.({
      url,
      cacheDel,
    });
  } catch (e) {
    debug && _logWarn("onRequest threw error: " + (e as Error).message);
  }

  if (options?.cache) {
    const data = inMemory.get(url) as T;
    if (data) {
      if (debug) {
        data && _cacheSuccessLog({ url, method, body: options?.body });
        _cacheDataLog(data);

        return data;
      }
    }
  }

  // --- FETCH ---
  try {
    debug && _logInfo(t("Base:info.start"));
    const response = await fetch(url, {
      method,
      headers,
      body: !["GET", "DELETE", "HEAD", "OPTIONS"].includes(method) ? body : null,
      signal: options?.signal,
    });

    if (response.ok) {
      const data = !["HEAD", "OPTIONS"].includes(method) ? ((await response.json()) as T) : null;

      // --- LOGS ---
      if (options?.cache) {
        if (data) {
          inMemory.set<T>(url, data);
          if (options?.cache !== true) {
            inMemory.ttl(url, options?.cache?.ttl ?? 1000);
          }
        }
      }

      // --- Logs ---
      if (debug) {
        _logInfo(t("Base:info.complete"));
        if (["HEAD", "OPTIONS"].includes(method)) {
          _systemHttpLog(response, method, url);
        } else {
          _httpSuccessLog({ url, method, body: options?.body });
          data ? httpDataLog(data) : _logWarn(t("Base:debug.empty"));
        }
      }

      // --- onResponse hook ---
      options?.hooks?.onResponse?.(data as T);

      return data as T;
    } else {
      debug && _httpErrLog(response.status);
      // noinspection ExceptionCaughtLocallyJS
      throw response;
    }
  } catch (err: any) {
    if (debug) {
      if (err instanceof Error && err.name === "AbortError") {
        _logError(`${t("Base:debug.abort")}`);
      } else if (!(err instanceof Response)) {
        _NetworkErrLog();
      }
    }

    // --- onError hook ---
    try {
      const retry = () => _request<T>(method, api, endpoint, options);

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
      debug && _logWarn("onError threw error: " + (hookErr as Error).message);
    }

    return null;
  }
}

/**
 * Wrapper for request with GET method. See {@link _request} for details.
 */
export const httpGet = <T>(api: apiType, endpoint?: string, options?: optionsType) =>
  _request<T>("GET", api, endpoint, options);

/**
 * Wrapper for request with DELETE method. See {@link _request} for details.
 */
export const httpDel = <T>(api: apiType, endpoint?: string, options?: optionsType) =>
  _request<T>("DELETE", api, endpoint, options);

/**
 * Wrapper for request with HEAD method. See {@link _request} for details.
 */
export const httpHead = <T>(api: apiType, endpoint?: string, options?: optionsType) =>
  _request<T>("HEAD", api, endpoint, options);

/**
 * Wrapper for request with OPTIONS method. See {@link _request} for details.
 */
export const httpOpt = <T>(api: apiType, endpoint?: string, options?: optionsType) =>
  _request<T>("OPTIONS", api, endpoint, options);

/**
 * Wrapper for request with POST method. See {@link _request} for details.
 */
export const httpPost = <T>(api: apiType, endpoint?: string, options?: optionsType) =>
  _request<T>("POST", api, endpoint, options);
/**
 * Wrapper for request with PUT method. See {@link _request} for details.
 */
export const httpPut = <T>(api: apiType, endpoint?: string, options?: optionsType) =>
  _request<T>("PUT", api, endpoint, options);

/**
 * Wrapper for request with PATCH method. See {@link _request} for details.
 */
export const httpPatch = <T>(api: apiType, endpoint?: string, options?: optionsType) =>
  _request<T>("PATCH", api, endpoint, options);
