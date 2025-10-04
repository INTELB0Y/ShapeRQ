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
  cacheDataLog,
  cacheSuccessLog,
} from "../utils/logger/logger";
import { t } from "../locales/i18";
import { getXsrfToken } from "./xsrfProtection";
import { cacheDel, inMemory } from "../utils/cache/cache";

/**
 * Function for sending requests to the API;
 * @param {methodType} `method` - request method, GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS
 * @param {apiType} `api` - API from config
 * @param {string} `endpoint` - API endpoint
 * @param {optionsType} `options` - options for the request, contain body, headers, xsrf, signal, hooks, cache
 */
async function request<T>(
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
  const body = options?.body instanceof FormData ? options.body : JSON.stringify(options?.body);
  const contentType =
    options?.body instanceof FormData ? "multipart/form-data" : "application/json";

  // --- Request headers ---
  const headers: headersType = {
    ...options?.headers,
    ...APIs[api]?.headers,
    "Content-Type": contentType,
  };

  // --- Auth header ---
  if (auth?.token()) {
    headers[String(auth.headerName || "Authorization")] =
      `${auth.prefix || "Bearer"} ${auth.token()}`;
  }

  // --- XSRF ---
  if (!safeMethods.includes(method) && options?.xsrf !== false) {
    if (typeof document !== "undefined") {
      const token: string | null = getXsrfToken();
      if (!token) {
        debug && logWarn(t("Base:debug.xsrf"));
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
      headers,
      body,
    });
  } catch (e) {
    debug && logWarn("onRequest threw error: " + (e as Error).message);
  }

  if (options?.cache) {
    const data = inMemory.get(url) as T;
    if (data) {
      if (debug) {
        data && cacheSuccessLog({ url, method, body: body });
        cacheDataLog(data);
      }
      return data;
    }
  }

  // --- FETCH ---
  try {
    debug && logInfo(t("Base:info.start"));
    const response = await fetch(url, {
      method,
      headers,
      body: !["DELETE", ...safeMethods].includes(method) ? body : null,
      signal: options?.signal,
      mode: options?.mode,
      credentials: options?.credentials,
    });

    if (response.ok) {
      let data: T | null;
      if (response.status !== 204) {
        data = !["HEAD", "OPTIONS"].includes(method) ? ((await response.json()) as T) : null;
      } else {
        data = { Http204: "Empty response" } as T;
      }

      if (options?.cache) {
        if (data) {
          inMemory.set<T>(url, data);
          if (options.cache !== true) {
            inMemory.ttl(url, options.cache);
          }
        }
      }

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

      return data as T;
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
 * Function for GET request;
 * @template T generic for returns data;
 * @param {apiType} `api` - API from config
 * @param {string} `endpoint` - API endpoint
 * @param {optionsType} `options` - options for the request, contain body, headers, xsrf, signal, hooks
 * @return {Promise<T | null>}: data or null if request failed
 */
export const httpGet = <T>(
  api: apiType,
  endpoint?: string,
  options?: optionsType,
): Promise<T | null> => request<T>("GET", api, endpoint, options);

/**
 * Function for DELETE request;
 * @template T generic for returns data;
 * @param {apiType} `api` - API from config
 * @param {string} `endpoint` - API endpoint
 * @param {optionsType} `options` - options for the request, contain body, headers, xsrf, signal, hooks
 * @return {Promise<T | null>}: data or null if request failed
 */
export const httpDel = <T>(
  api: apiType,
  endpoint?: string,
  options?: optionsType,
): Promise<T | null> => request<T>("DELETE", api, endpoint, options);

/**
 * Function for HEAD request;
 * @template T generic for returns data;
 * @param {apiType} `api` - API from config
 * @param {string} `endpoint` - API endpoint
 * @param {optionsType} `options` - options for the request, contain body, headers, xsrf, signal, hooks
 * @return {Promise<T | null>}: data or null if request failed
 */
export const httpHead = <T>(
  api: apiType,
  endpoint?: string,
  options?: optionsType,
): Promise<T | null> => request<T>("HEAD", api, endpoint, options);

/**
 * Function for OPTIONS request;
 * @template T generic for returns data;
 * @param {apiType} `api` - API from config
 * @param {string} `endpoint` - API endpoint
 * @param {optionsType} `options` - options for the request, contain body, headers, xsrf, signal, hooks
 * @return {Promise<T | null>}: data or null if request failed
 */
export const httpOpt = <T>(
  api: apiType,
  endpoint?: string,
  options?: optionsType,
): Promise<T | null> => request<T>("OPTIONS", api, endpoint, options);

/**
 * Function for POST request;
 * @template T generic for returns data;
 * @param {apiType} `api` - API from config
 * @param {string} `endpoint` - API endpoint
 * @param {optionsType} `options` - options for the request, contain body, headers, xsrf, signal, hooks
 * @return {Promise<T | null>}: data or null if request failed
 */
export const httpPost = <T>(
  api: apiType,
  endpoint?: string,
  options?: optionsType,
): Promise<T | null> => request<T>("POST", api, endpoint, options);

/**
 * Function for PUT request;
 * @template T generic for returns data;
 * @param {apiType} `api` - API from config
 * @param {string} `endpoint` - API endpoint
 * @param {optionsType} `options` - options for the request, contain body, headers, xsrf, signal, hooks
 * @return {Promise<T | null>}: data or null if request failed
 */
export const httpPut = <T>(
  api: apiType,
  endpoint?: string,
  options?: optionsType,
): Promise<T | null> => request<T>("PUT", api, endpoint, options);

/**
 * Function for PATCH request;
 * @template T generic for returns data;
 * @param {apiType} `api` - API from config
 * @param {string} `endpoint` - API endpoint
 * @param {optionsType} `options` - options for the request, contain body, headers, xsrf, signal, hooks
 * @return {Promise<T | null>}: data or null if request failed
 */
export const httpPatch = <T>(
  api: apiType,
  endpoint?: string,
  options?: optionsType,
): Promise<T | null> => request<T>("PATCH", api, endpoint, options);
