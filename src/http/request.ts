import { method, body, headers } from "./types";
import { getConfig } from "../core/config";
import { logWarn, logSuccess, logError, logInfo } from "../utils/logger";

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
  const { baseURL, auth, debug } = getConfig();
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
        logSuccess(`Запрос на ${url} вернул статус: ${response.status}`);
        logInfo(`Полученные данные: ${JSON.stringify(data, null, 2)}`);
      }
      return data;
    } else {
      if (debug) {
        logWarn(`Запрос на ${url} вернул статус: ${response.status}`);
        logError(`Ошибка: ${response.statusText}`);
      }
      return null;
    }
  } catch (err) {
    if (debug) {
      alert(`Ошибка запроса!\n Информация об ошибке:${err}`);
      logWarn(`Произошла ошибка при запросе.`);
      logError(`Сообщение об ошибке:\n${err}`);
    }
    return null;
  }
}

/**
 * get - Функция для отправки GET запроса
 * post - Функция для отправки POST запроса
 * put - Функция для отправки PUT запроса
 * del - Функция для отправки DELETE запроса
 * @param url - Эндпоинт API
 */
export const get = (url: string) => request("GET", url);
export const post = (url: string, body: body) => request("POST", url, body);
export const put = (url: string, body: body) => request("PUT", url, body);
export const del = (url: string) => request("DELETE", url);
