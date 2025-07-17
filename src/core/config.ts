import type { iShapeRQConfig } from "../types";

class Configure {
  static #config: iShapeRQConfig | null = null;

  static create(config: iShapeRQConfig): void {
    if (this.#config) {
      throw new Error("Config is already exist, to change  it use changeConfig()");
    }
    this.#config = config;
  }

  static change(config: Partial<iShapeRQConfig>): void {
    if (!this.#config) {
      throw new Error("You should create a new config");
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
      throw new Error("You should create a new config");
    }
    return this.#config;
  }
}

export const createConfig = (config: iShapeRQConfig) => Configure.create(config);
export const changeConfig = (config: iShapeRQConfig) => Configure.change(config);
export const getConfig = () => Configure.get();
