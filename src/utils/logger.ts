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

export function logError(msg: string): void {
  console.error(`%c[ShapeRQ] ❌ ${msg}`, styles.error);
}

// TODO: При создании расширенного дебага сделаем подробный дебаг лог.
// export function logDebug(msg: string) {
//     console.log(`%c[ShapeRQ] 🐞 ${msg}`, 'color: #9E9E9E; font-style: italic;')
// }
