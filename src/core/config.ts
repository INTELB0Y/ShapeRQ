export interface ShapeRQConfig {
    baseURL: string;
    auth?: {
        token: string;
        headerName?: string; // например "Authorization" или "X-Token"
        prefix?: string; // например "Bearer" или "Token"
    };
    debug?: boolean;
    headers?: Record<string, string>; // глобальные заголовки
}

let config: ShapeRQConfig = {
    baseURL: "",
    debug: false,
};

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
    };
}

export function getConfig(): ShapeRQConfig {
    return config;
}
