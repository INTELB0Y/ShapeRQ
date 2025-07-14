import { t } from "../../locales/i18";
import {
  simpleStyles,
  geckoDataStyles,
  geckoSuccessStyles,
  geckoErrStyles,
  blinkErrStyles,
  blinkSuccessStyles,
  blinkDataStyles,
} from "./styles/styles";
import type { httpDataType, StylesType, methodType } from "../../types";

const getBrowserEngine = () => {
  const userAgent = navigator.userAgent;
  if (userAgent.includes(`Firefox`)) {
    return "gecko";
  } else {
    return "blink";
  }
};

export function systemHttpLog(response: Response, method: methodType, url: string): void {
  const styles = getBrowserEngine() ? geckoSuccessStyles : blinkSuccessStyles;

  const lines = [
    `%c🛠️ ${t("Base:debug.success")}`,
    `%c${method} - ${response.status} - ${url}`,
    `%c${method === "OPTIONS" ? response.headers.get("allow") : null}`,
    `%c${JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)}`,
  ];

  const styleValues = [styles.title, styles.message, styles.message, styles.body || ""];

  console.info(lines.join("\n"), ...styleValues);
}

export function logInfo(msg: string): void {
  console.info(`%c[ShapeRQ] ℹ️ ${msg}`, simpleStyles.info);
}

export function httpDataLog(data: any): void {
  const styles: StylesType = getBrowserEngine() === "gecko" ? geckoDataStyles : blinkDataStyles;

  const lines: string[] = [`%cℹ️ ${t("Base:debug.data")}`, `%c${JSON.stringify(data, null, 2)}`];

  const styleValues = [styles.title, styles.message];

  console.info(lines.join("\n"), ...styleValues);
}

export function cacheDataLog(data: any): void {
  const styles: StylesType = getBrowserEngine() === "gecko" ? geckoDataStyles : blinkDataStyles;

  const lines: string[] = [`%cℹ️ ${t("Base:debug.cache")}`, `%c${JSON.stringify(data, null, 2)}`];

  const styleValues = [styles.title, styles.message];

  console.info(lines.join("\n"), ...styleValues);
}

export function logSuccess(msg: string): void {
  console.log(`%c[ShapeRQ] ✅ ${msg}`, simpleStyles.success);
}

export function httpSuccessLog(info: httpDataType): void {
  const styles: StylesType =
    getBrowserEngine() === "gecko" ? geckoSuccessStyles : blinkSuccessStyles;

  const lines: string[] = [
    `%c✅ ${t("Base:debug.success")}\n` +
      `%c${info.url}\n` +
      `${info.method}\n` +
      `%c${info.body ? t("Base:debug.body") + "\n" + JSON.stringify(info.body, null, 2) : ""}`,
  ];

  const styleValues: string[] = [styles.title, styles.message, styles.body ?? ""];

  console.log(lines.join("\n"), ...styleValues);
}

export function cacheSuccessLog(info: httpDataType): void {
  const styles: StylesType =
    getBrowserEngine() === "gecko" ? geckoSuccessStyles : blinkSuccessStyles;

  const lines: string[] = [
    `%c✅ ${t("Base:debug.cacheSuccess")}\n` +
      `%c${info.url}\n` +
      `${info.method}\n` +
      `%c${info.body ? t("Base:debug.body") + "\n" + JSON.stringify(info.body, null, 2) : ""}`,
  ];

  const styleValues: string[] = [styles.title, styles.message, styles.body ?? ""];

  console.log(lines.join("\n"), ...styleValues);
}

export function logWarn(msg: string): void {
  console.warn(`%c[ShapeRQ] ⚠️ ${msg}`, simpleStyles.warn);
}

export function logError(msg: string): void {
  console.error(`%c[ShapeRQ] ❌ ${msg}`, simpleStyles.error);
}

export function httpErrLog(status: number): void {
  let styles: StylesType = getBrowserEngine() === "gecko" ? geckoErrStyles : blinkErrStyles;

  const lines: string[] = [
    `%c${t(`Http:${status}.title`)}`,
    `%c${t(`Http:${status}.message`)}`,
    `%c${styles.separator || "\n"}`,
    `%c${t(`Http:${status}.doc`)}`,
  ];

  const styleValues: string[] = [
    styles.title,
    styles.message,
    styles.separator ?? "",
    styles.doc ?? "",
  ];

  console.error(lines.join("\n"), ...styleValues);
}

export function NetworkErrLog(): void {
  let styles: StylesType = getBrowserEngine() === "gecko" ? geckoErrStyles : blinkErrStyles;

  const lines = [
    `%c${t(`Http:networkError.title`)}`,
    `%c${t(`Http:networkError.possibleCauses`)}`,
    `%c${styles.separator || ""}`,
    `%c${t(`Http:networkError.suggestions`)}`,
    `%c${styles.separator || "\n"}`,
    `%c${t(`Http:networkError.doc`)}`,
  ];

  const styleValues: string[] = [
    styles.title,
    styles.message,
    styles.separator ?? "",
    styles.message,
    styles.separator ?? "",
    styles.doc ?? "",
  ];

  console.error(lines.join("\n"), ...styleValues);
}
