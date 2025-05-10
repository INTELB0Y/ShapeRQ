/**
 * baseURL - URL на который будут отправляться запросы по умолчанию,
 * рекомендуется использовать его значение как `${export.meta.env.VITE_API_URL}`
 * auth - Параметры авторизации для запроса, где:
 * - token - токен авторизации
 * - headerName - имя заголовка, 'Authorization' как пример
 * - prefix - префикс для токена, 'Bearer' как пример
 */

export interface ShapeRQConfig {
  baseURL: string;
  auth?: {
    token?: string;
    headerName?: string;
    prefix?: string;
  };
  debug?: boolean;
  headers?: Record<string, string>;
  lang?: "ru" | "en";
}

let config: ShapeRQConfig = {
  baseURL: "",
  debug: true,
};

/**
 * setConfig - Функция изменения изначальной конфигурации
 * @param userConfig - Ваши параметры конфигурации
 */

export function setConfig(userConfig: Partial<ShapeRQConfig>) {
  config = {
    ...config,
    ...userConfig,
    auth: {
      ...config.auth,
      ...userConfig.auth,
    },
    headers: {
      ...config.headers,
      ...userConfig.headers,
    },
    lang: userConfig.lang || config.lang,
  };
}

export function getConfig(): ShapeRQConfig {
  return config;
}
