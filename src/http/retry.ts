import { getConfig } from "../core/config";
import { t } from "../locales/i18";
import { headersType, methodType } from "../types";
import {
  httpDataLog,
  httpErrLog,
  httpSuccessLog,
  logInfo,
  logWarn,
  NetworkErrLog,
  systemHttpLog,
} from "../utils/logger/logger";

export async function funcRetry(
  method: methodType,
  headers: headersType,
  url: string,
  body?: string | null,
) {
  const { debug } = getConfig();
  try {
    debug && logInfo(t("Base:info.start"));
    const response = await fetch(url, {
      method,
      headers,
      body: !["GET", "DELETE", "HEAD", "OPTIONS"].includes(method)
        ? JSON.stringify(body)
        : null,
    });
    if (response.ok) {
      const data = !["HEAD", "OPTIONS"].includes(method)
        ? await response.json()
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
    }
  } catch (err) {
    if (debug) {
      console.info(JSON.stringify(err));
      NetworkErrLog();
    }
  }
  return null;
}
