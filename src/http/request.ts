import { method, body, headers, api } from "./types";
import { getConfig } from "../core/config";
import {
  logWarn,
  logInfo,
  httpErrLog,
  httpDataLog,
  httpSuccessLog,
  NetworkErrLog,
  systemHttpLog,
} from "../utils/logger/logger";
import { t } from "../locales/i18";

/**
 * request - Function for sending requests to the API;
 * @param method - request method, GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS
 * @param api - API from config
 * @param endpoint - API endpoint
 * @param body - Request body if needed
 */
async function request<T>(
  method: method,
  api: api,
  endpoint?: string,
  body?: body,
): Promise<T | null> {
  const { APIs, auth, debug, retry } = getConfig();
  const url = APIs[api] + endpoint;
  const retryStatus = [408, 425, 429, 500, 502, 503, 504];
  const time = retry?.time ?? 1;
  const delay = (ms: number) =>
    new Promise((res) => setTimeout(() => res("lf"), ms));

  const headers: headers = {
    "content-type": "application/json",
  };

  if (auth?.token)
    headers[auth.headerName || "Authorization"] =
      `${auth.prefix || "Bearer"} ${auth.token}`;

  try {
    debug && logInfo(t("Base:info.start"));
    const response = await fetch(url, {
      method,
      headers,
      body: !["GET", "DELETE", "HEAD", "OPTIONS"].includes(method)
        ? JSON.stringify(body)
        : null,
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
            body: body,
          });
          data ? httpDataLog(data) : logWarn(t("Base:debug.empty"));
        }
      }
      return data;
    } else {
      if (debug) {
        httpErrLog(response.status);
      }
      if (
        retry?.attempts &&
        retry.attempts &&
        retryStatus.includes(response.status)
      ) {
        for (let index = 1; index < retry.attempts; index++) {
          await delay(time * 1000);
          const data = await funcRetry(method, headers, url, body);
          if (data) {
            return data;
          }
        }
        if (debug) {
          httpErrLog(retry.error);
        }

        return null;
      }

      return null;
    }
  } catch (err: any) {
    if (debug) {
      console.info(JSON.stringify(err));
      NetworkErrLog();
    }

    if (retry?.attempts && retry.attempts > 0) {
      for (let index = 1; index < retry.attempts; index++) {
        await delay(time * 1000);
        const data = await funcRetry(method, headers, url, body);
        if (data) {
          return data;
        }
      }
      return null;
    }

    return null;
  }
}

async function funcRetry(
  method: method,
  headers: headers,
  url: string,
  body?: body,
) {
  const { debug } = getConfig();
  try {
    debug && logInfo(t("Base:info.start"));
    const response = await fetch(url, {
      method,
      headers,
      body: !["GET", "DELETE", "HEAD", "OPTIONS"].includes(method)
        ? JSON.stringify(body)
        : null,
    });
    if (response.ok) {
      const data = !["HEAD", "OPTIONS"].includes(method)
        ? await response.json()
        : null;
      if (debug) {
        logInfo(t("Base:info.complete"));
        if (["HEAD", "OPTIONS"].includes(method)) {
          systemHttpLog(response, method, url);
        } else {
          httpSuccessLog({
            url: url,
            method: method,
            body: body,
          });
          data ? httpDataLog(data) : logWarn(t("Base:debug.empty"));
        }
      }
      return data;
    } else {
      if (debug) {
        httpErrLog(response.status);
      }
    }
  } catch (err) {
    if (debug) {
      console.info(JSON.stringify(err));
      NetworkErrLog();
    }
  }
  return null;
}

/**
 * get - Function for sending GET request;
 * @param api - API from config
 * @param endpoint - API endpoint
 */
export const get = (api: api, endpoint: string) =>
  request("GET", api, endpoint);

/**
 * del - Function for sending DELETE request;
 * @param api - API from config
 * @param endpoint - API endpoint
 */
export const del = (api: api, endpoint: string) =>
  request("DELETE", api, endpoint);
/**
 * head - Function for sending HEAD request;
 * @param api - API from config
 * @param endpoint - API endpoint
 */
export const head = (api: api, endpoint: string) =>
  request("HEAD", api, endpoint);
/**
 * options - Function for sending OPTIONS request;
 * @param api - API from config
 * @param endpoint - API endpoint
 */
export const options = (api: api, endpoint: string) =>
  request("OPTIONS", api, endpoint);
/**
 * post - Function for sending POST request;
 * @param api - API from config
 * @param endpoint - API endpoint
 * @param body - Body of the request
 */
export const post = (api: api, endpoint: string, body: body) =>
  request("POST", api, endpoint, body);
/**
 * put - Function for sending PUT request;
 * @param api - API from config
 * @param endpoint - API endpoint
 * @param body - Body of the request
 */
export const put = (api: api, endpoint: string, body: body) =>
  request("PUT", api, endpoint, body);

/**
 * patch - Function for sending PATCH request;
 * @param api - API from config
 * @param endpoint - API endpoint
 * @param body - Body of the request
 */
export const patch = (api: api, endpoint: string, body: body) =>
  request("PATCH", api, endpoint, body);
