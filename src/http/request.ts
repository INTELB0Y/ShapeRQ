import {method, body, headers, api} from "./types";
import {getConfig} from "../core/config";
import {
    logWarn,
    logInfo,
    httpErrLog,
    httpDataLog,
    httpSuccessLog,
    NetworkErrLog,
    systemHttpLog, logError,
} from "../utils/logger/logger";
import {t} from "../locales/i18";
import {getXsrfToken} from "./xsrfSafe";

/**
 * request - Function for sending requests to the API;
 * @param method - request method, GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS
 * @param api - API from config
 * @param endpoint - API endpoint
 * @param body - Request body if needed
 * @param signal - Abort signal
 */
async function request<T>(
    method: method,
    api: api,
    endpoint?: string,
    body?: body,
    signal?: AbortSignal,
): Promise<T | null> {
    const {APIs, auth, debug} = getConfig();
    const url: string = APIs[api] + endpoint;
    const safeMethods: method[] = ["GET", "HEAD", "OPTIONS"];


    const headers: headers = {
        "content-type": "application/json",
    };

    if (auth?.token)
        headers[auth.headerName || "Authorization"] =
            `${auth.prefix || "Bearer"} ${auth.token}`;

    if (!safeMethods.includes(method)) {
        const token = getXsrfToken();
        if (!token) {
            logWarn(t("Base:debug.xsrf"))
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
                ? JSON.stringify(body)
                : null,
            signal
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
 * get - Function for sending GET request;
 * @param api - API from config
 * @param endpoint - API endpoint
 * @param signal - Abort signal
 */
export const get = (api: api, endpoint: string, signal?: AbortSignal) =>
    request("GET", api, endpoint, signal);

/**
 * del - Function for sending DELETE request;
 * @param api - API from config
 * @param endpoint - API endpoint
 * @param signal - Abort signal
 */
export const del = (api: api, endpoint: string, signal?: AbortSignal) =>
    request("DELETE", api, endpoint, signal);
/**
 * head - Function for sending HEAD request;
 * @param api - API from config
 * @param endpoint - API endpoint
 * @param signal - Abort signal
 */
export const head = (api: api, endpoint: string, signal?: AbortSignal) =>
    request("HEAD", api, endpoint, signal);
/**
 * options - Function for sending OPTIONS request;
 * @param api - API from config
 * @param endpoint - API endpoint
 * @param signal - Abort signal
 */
export const options = (api: api, endpoint: string, signal?: AbortSignal) =>
    request("OPTIONS", api, endpoint, signal);
/**
 * post - Function for sending POST request;
 * @param api - API from config
 * @param endpoint - API endpoint
 * @param body - Body of the request
 * @param signal - Abort signal
 */
export const post = (api: api, endpoint: string, body: body, signal?: AbortSignal) =>
    request("POST", api, endpoint, body, signal);
/**
 * put - Function for sending PUT request;
 * @param api - API from config
 * @param endpoint - API endpoint
 * @param body - Body of the request
 * @param signal - Abort signal
 */
export const put = (api: api, endpoint: string, body: body, signal?: AbortSignal) =>
    request("PUT", api, endpoint, body, signal);

/**
 * patch - Function for sending PATCH request;
 * @param api - API from config
 * @param endpoint - API endpoint
 * @param body - Body of the request
 * @param signal - Abort signal
 */
export const patch = (api: api, endpoint: string, body: body, signal?: AbortSignal) =>
    request("PATCH", api, endpoint, body, signal);
