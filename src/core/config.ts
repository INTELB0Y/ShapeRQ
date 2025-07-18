import type { iShapeRQConfig } from "../types";

class Configure {
  static #config: iShapeRQConfig | null = null;

  static create(config: iShapeRQConfig): void {
    if (this.#config) {
      throw new Error("Config is already exists, use changeConfig() to change it.");
    }
    this.#config = config;
  }

  static change(config: Partial<iShapeRQConfig>): void {
    if (!this.#config) {
      throw new Error("You haven't created a config yet, so it cannot be changed.");
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
      throw new Error("You should create a new config via createConfig() before use any requests;");
    }
    return this.#config;
  }
}

/**
 * Function for creation a new configuration;
 * Cannot be used if config already exist;
 * @param {iShapeRQConfig} config - new config
 */
export const createConfig = (config: iShapeRQConfig) => Configure.create(config);

/**
 * Function for update an existence configuration;
 * Cannot be used if config is not created;
 * @param {Partial<iShapeRQConfig>} config - updated config
 */
export const changeConfig = (config: iShapeRQConfig) => Configure.change(config);

export const getConfig = () => Configure.get();
