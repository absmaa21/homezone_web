import {Log} from "./Logging.ts";

export abstract class Storage {

  public static save(key: string, value: object | string): void {
    Log.info('Saving using ' + key)
    if (typeof value !== "string") {
      value = JSON.stringify(value)
    }
    localStorage.setItem(key, value)
  }

  public static load(key: string): string | null {
    return localStorage.getItem(key)
  }

  public static remove(key: string) {
    localStorage.removeItem(key)
  }

}
