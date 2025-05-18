import {t} from "../locales/i18";

type iStyles = {
  info: string;
  success: string;
  warn: string;
  error: string;
};

const styles: iStyles = {
  info: "color: #42A5F5;",
  success: "color: #66BB6A; font-weight: bold;",
  warn: "color: #FFA726; font-weight: bold;",
  error: "color: #EF5350; font-weight: bold;",
};

export function logInfo(msg: string): void {
  console.info(`%c[ShapeRQ] ℹ️ ${msg}`, styles.info);
}

export function logSuccess(msg: string): void {
  console.log(`%c[ShapeRQ] ✅ ${msg}`, styles.success);
}

export function logWarn(msg: string): void {
  console.warn(`%c[ShapeRQ] ⚠️ ${msg}`, styles.warn);
}

// TODO: Подумать, есть ли от него смысл?
export function logError(msg: string): void {
  console.error(`%c[ShapeRQ] ❌ ${msg}`, styles.error);
}

export function httpErrLog(status: number): void {
  console.error(
      `%c${t(`Http:${status}.title`)}` +
      "%c \n" +
      `%c${t(`Http:${status}.message`)}` +
      `%c${t(`Http:${status}.doc`)}`,
      "color: #EF5350; font-weight: bold; font-size: 20px;",
      "display: block; border-bottom: 1px solid #EF5350; margin-top: -12px",
      "color: #EF5350; font-size: 12px; font-weight: 400",
      "font-size: 11px;"
  )
}

// TODO: При создании расширенного дебага сделаем подробный дебаг лог.
// export function logDebug(msg: string) {
//     console.log(`%c[ShapeRQ] 🐞 ${msg}`, 'color: #9E9E9E; font-style: italic;')
// }
