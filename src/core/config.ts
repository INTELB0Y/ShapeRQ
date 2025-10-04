import type { iAsperyConfig } from "../types";

class Configure {
  static #config: iAsperyConfig | null = null;

  static create(config: iAsperyConfig): void {
    if (this.#config) {
      throw new Error("Config is already exists, use changeConfig() to change it.");
    }
    this.#config = config;
  }

  static change(config: Partial<iAsperyConfig>): void {
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

  static get(): iAsperyConfig {
    if (!this.#config) {
      throw new Error("You should create a new config via createConfig() before use any requests;");
    }
    return this.#config;
  }
}

/**
 * Function for creation a new configuration;
 * Cannot be used if config already exist;
 * @param {iAsperyConfig} config - new config
 */
export const createConfig = (config: iAsperyConfig) => Configure.create(config);

/**
 * Function for update an existence configuration;
 * Cannot be used if config is not created;
 * @param {Partial<iAsperyConfig>} config - updated config
 */
export const changeConfig = (config: iAsperyConfig) => Configure.change(config);

export const getConfig = () => Configure.get();
