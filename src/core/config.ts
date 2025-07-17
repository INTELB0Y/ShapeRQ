import type { iShapeRQConfig } from "../types";
import { t } from "../locales/i18.ts";

class Configure {
  static #config: iShapeRQConfig | null = null;

  static create(config: iShapeRQConfig): void {
    if (this.#config) {
      throw new Error(t("Base:config.shouldChange"));
    }
    this.#config = config;
  }

  static change(config: Partial<iShapeRQConfig>): void {
    if (!this.#config) {
      throw new Error(t("Base:config.shouldCreate"));
    }

    this.#config = {
      ...this.#config,
      ...config,
      APIs: {
        ...this.#config.APIs,
        ...config.APIs,
      },
      lang: config.lang || this.#config.lang,
    };
  }

  static get(): iShapeRQConfig {
    if (!this.#config) {
      throw new Error(t("Base:config.shouldCreate"));
    }
    return this.#config;
  }
}

export const createConfig = (config: iShapeRQConfig) => Configure.create(config);
export const changeConfig = (config: iShapeRQConfig) => Configure.change(config);
export const getConfig = () => Configure.get();
