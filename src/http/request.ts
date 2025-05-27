import { methodType, headersType, apiType, optionsType } from "../types";
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
import { getXsrfToken } from "./xsrfSafe";

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
  const url: string = APIs[api] + endpoint;
  const safeMethods: methodType[] = ["GET", "HEAD", "OPTIONS"];

  const headers: headersType = {
    "content-type": "application/json",
  };

  if (auth) {
    if (typeof auth === "object" && "token" in auth) {
      headers[String(auth.headerName || "Authorization")] =
        `${auth.prefix || "Bearer"} ${auth.token}`;
    } else if (
      typeof auth === "object" &&
      api in auth &&
      auth[api] &&
      "token" in auth[api]
    ) {
      headers[String(auth[api].headerName || "Authorization")] =
        `${auth[api].prefix || "Bearer"} ${auth[api].token}`;
    }
  }

  if (!safeMethods.includes(method) && options?.xsrf !== false) {
    const token = getXsrfToken();
    if (!token) {
      debug && logWarn(t("Base:debug.xsrf"));
      return null;
    }
    headers["X-CSRFToken"] = token;
  }

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
      if (debug) {
        logInfo(t("Base:info.complete"));
        if (["HEAD", "OPTIONS"].includes(method)) {
          systemHttpLog(response, method, url);
        } else {
          httpSuccessLog({
            url: url,
            method: method,
            body: options?.body,
          });
          data ? httpDataLog(data) : logWarn(t("Base:debug.empty"));
        }
      }
      return data;
    } else {
      if (debug) {
        httpErrLog(response.status);
      }
      return null;
    }
  } catch (err) {
    if (debug) {
      if (err instanceof Error && err.name === "AbortError") {
        logError(`${t("Base:debug.abort")} Причина:\n ${err.message}`);
      } else {
        NetworkErrLog();
      }
      throw err;
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
export const httpGet = (api: apiType, endpoint: string, options?: optionsType) =>
  request("GET", api, endpoint, options);

/**
 * httpDel - Function for sending DELETE request;
 * @param api - API from config
 * @param endpoint - API endpoint
 * @param options - Request options, can contain body and signal
 */
export const httpDel = (api: apiType, endpoint: string, options?: optionsType) =>
  request("DELETE", api, endpoint, options);
/**
 * httpHead - Function for sending HEAD request;
 * @param api - API from config
 * @param endpoint - API endpoint
 * @param options - Request options, can contain body and signal
 */
export const httpHead = (api: apiType, endpoint: string, options?: optionsType) =>
  request("HEAD", api, endpoint, options);
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
export const httpPost = (api: apiType, endpoint: string, options?: optionsType) =>
  request("POST", api, endpoint, options);
/**
 * httpPut - Function for sending PUT request;
 * @param api - API from config
 * @param endpoint - API endpoint
 * @param options - Request options, can contain body and signal
 */
export const httpPut = (api: apiType, endpoint: string, options?: optionsType) =>
  request("PUT", api, endpoint, options);

/**
 * httpPatch - Function for sending PATCH request;
 * @param api - API from config
 * @param endpoint - API endpoint
 * @param options - Request options, can contain body and signal
 */
export const httpPatch = (api: apiType, endpoint: string, options?: optionsType) =>
  request("PATCH", api, endpoint, options);
