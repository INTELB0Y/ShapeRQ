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
import { inMemory } from "../utils/cache/cache";

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
  const { APIs, debug } = getConfig();
  const auth = APIs[api].auth;
  const url = APIs[api].url + (endpoint || "");
  const safeMethods: methodType[] = ["GET", "HEAD", "OPTIONS"];

  // --- REQUEST HEADERS ---
  const headers: headersType = {
    ...APIs[api].headers,
    "content-type": "application/json",
  };

  // --- AUTH HEADER ---
  if (auth) {
    headers[String(auth.headerName || "Authorization")] =
      `${auth.prefix || "Bearer"} ${auth.token}`;
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

  if (options?.cache?.type) {
    const data = inMemory.get(url) as T;
    if (data) {
      data &&
        (httpSuccessLog({ url, method, body: options?.body }),
        httpDataLog(data));
      return data;
    }
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
      if (options?.cache?.type) {
        data &&
          (inMemory.set<T>(url, data),
          inMemory.ttl(url, options?.cache?.ttl ?? 1000));
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
 * Wrapper for request with GET method. See {@link request} for details.
 */
export const httpGet = (
  api: apiType,
  endpoint: string,
  options?: optionsType,
) => request("GET", api, endpoint, options);

/**
 * Wrapper for request with DELETE method. See {@link request} for details.
 */
export const httpDel = (
  api: apiType,
  endpoint: string,
  options?: optionsType,
) => request("DELETE", api, endpoint, options);

/**
 * Wrapper for request with HEAD method. See {@link request} for details.
 */
export const httpHead = (
  api: apiType,
  endpoint: string,
  options?: optionsType,
) => request("HEAD", api, endpoint, options);

/**
 * Wrapper for request with OPTIONS method. See {@link request} for details.
 */
export const httpOpt = (
  api: apiType,
  endpoint: string,
  options?: optionsType,
) => request("OPTIONS", api, endpoint, options);

/**
 * Wrapper for request with POST method. See {@link request} for details.
 */
export const httpPost = (
  api: apiType,
  endpoint: string,
  options?: optionsType,
) => request("POST", api, endpoint, options);
/**
 * Wrapper for request with PUT method. See {@link request} for details.
 */
export const httpPut = (
  api: apiType,
  endpoint: string,
  options?: optionsType,
) => request("PUT", api, endpoint, options);

/**
 * Wrapper for request with PATCH method. See {@link request} for details.
 */
export const httpPatch = (
  api: apiType,
  endpoint: string,
  options?: optionsType,
) => request("PATCH", api, endpoint, options);
