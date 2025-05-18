import {getConfig} from "../core/config";
import {locales} from "./index";

function getValueByPath(obj: any, path: string[]): any {
  return path.reduce((acc, key) => acc?.[key], obj);
}

function interpolate(str: string, vars?: Record<string, any>): string {
  if (!vars) return str;
  return str.replace(/\$\{([^}]+)\}/g, (_, expr) => {
    try {
      return Function(...Object.keys(vars), `return ${expr}`)(...Object.values(vars));
    } catch {
      return `[err:${expr}]`;
    }
  });
}

/**
 * @param key Строка типа "Debug:ключ.значение"
 * @param vars Переменные для подстановки в шаблон
 */
export function t(key: string, vars?: Record<string, any>): string {
  const [namespace, ...rest] = key.split(":");
  const path = rest.join(".").split(".");
  const lang = getConfig().lang;

  // @ts-ignore
  const dict = locales[lang]?.[namespace];
  if (!dict) return `[missing namespace "${namespace}"]`;

  const value = getValueByPath(dict, path);
  if (value == null) return `[missing key "${key}"]`;

  return interpolate(value, vars);
}
