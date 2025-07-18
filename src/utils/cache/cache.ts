export class inMemory {
  static #cache = new Map<string, any>();

  static set<T>(url: string, data: T) {
    this.#cache.set(url, data);
  }

  static get(url: string) {
    return this.#cache.get(url);
  }

  static delete(url: string) {
    this.#cache.delete(url);
  }

  static ttl(url: string, time: number) {
    setTimeout(() => {
      this.delete(url);
    }, time);
  }
}

/**
 * Function for force cache deleting;
 * @param {string} url the URL from which the data was cached;
 */
export const cacheDel = (url: string) => inMemory.delete(url);
