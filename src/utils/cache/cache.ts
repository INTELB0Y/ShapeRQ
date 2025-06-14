export class inMemory {
  static #cache = new Map<string, any>();

  static set(url: string, data: any) {
    this.#cache.set(url, data);
  }
  static get(url: string) {
    return this.#cache.get(url);
  }
  static ttl(url: string, time: number) {
    setTimeout(
      () => {
        this.#cache.delete(url);
      },
      time * 1000 * 60,
    );
  }
}
