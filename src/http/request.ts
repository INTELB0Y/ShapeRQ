import {method, body, headers} from "./types";
import {getConfig} from "../core/config";
import {logWarn, logSuccess, logError, logInfo, httpErrLog} from "../utils/logger";
import {t} from "../locales/i18";

/**
 * request - Функция низшего порядка, основа для запросов порядком выше
 * @param method - Метод запроса, GET, POST, PUT, DELETE
 * @param endpoint - Эндпоинт API
 * @param body - Тело запроса, если необходимо
 */
async function request<T>(
    method: method,
    endpoint?: string,
    body?: body,
): Promise<T | null> {
    const {baseURL, auth, debug} = getConfig();
    const url = baseURL + endpoint;

    const headers: headers = {
        "content-type": "application/json",
    };

    if (auth?.token)
        headers[auth.headerName || "Authorization"] =
            `${auth.prefix || "Bearer"} ${auth.token}`;

    try {
        const response = await fetch(url, {
            method,
            headers,
            body: !["GET", "DELETE"].includes(method) ? JSON.stringify(body) : null,
        });
        if (response.ok) {
            const data = (await response.json()) as T;
            if (debug) {
                logSuccess(
                    t("Debug:try.success.message", {
                        url,
                        status: response.status,
                    }),
                );
                logInfo(
                    t("Debug:try.success.data", {
                        data: data,
                    }),
                );
            }
            return data;
        } else {
            if (debug) {
                httpErrLog(response.status)
            }
            return null;
        }
    } catch (err) {
        if (debug) {
            logWarn(t("Base:warn.smthWentWrong"));
            logError(t("Debug:catch.error", {err: err}));
        }
        return null;
    }
}

/**
 * get - Функция для отправки GET запроса;
 * post - Функция для отправки POST запроса;
 * put - Функция для отправки PUT запроса;
 * del - Функция для отправки DELETE запроса;
 * @param endpoint - Эндпоинт API
 */
export const get = (endpoint: string) => request("GET", endpoint);
export const post = (url: string, body: body) => request("POST", url, body);
export const put = (url: string, body: body) => request("PUT", url, body);
export const del = (url: string) => request("DELETE", url);
