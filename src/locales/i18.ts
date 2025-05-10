import { getConfig } from "../core/config";
import { locales } from "./index";

export function t(path: string, vars: Record<string, any> = {}) {
  const lang = getConfig().lang || "en";
  const locale = locales[lang];

  const keys = path.split(".");
  let template = keys.reduce((acc: any, key) => acc?.[key], locale);

  if (typeof template !== "string") return path;

  return template.replace(/\$\{(.*?)\}/g, (_, key) => vars[key.trim()] ?? "");
}
