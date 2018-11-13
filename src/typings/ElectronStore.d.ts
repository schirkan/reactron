type JSONValue = string | number | boolean | JSONObject | JSONArray;

// tslint:disable-next-line:interface-name
interface JSONObject {
    [x: string]: JSONValue;
}

// tslint:disable-next-line:interface-name
interface JSONArray extends Array<JSONValue> { }

// tslint:disable-next-line:interface-name
interface ElectronStoreOptions<T> {
    /**
     * Default data.
     */
    defaults?: T;

    /**
     * Name of the storage file (without extension).
     */
    name?: string;

    /**
     * Storage file location. Don't specify this unless absolutely necessary!
     */
    cwd?: string;

    /**
     * When specified, the store will be encrypted using the aes-256-cbc encryption algorithm.
     */
    encryptionKey?: string | Buffer;
}

declare class ElectronStore<T = {}> implements Iterable<[string, JSONValue]> {
    constructor(options?: ElectronStoreOptions<T>);

    /**
     * Set an item.
     */
    public set<K extends keyof T>(key: K, value: T[K]): void;
    public set(key: string, value: any): void;

    /**
     * Set multiple items at once.
     */
    public set(object: Pick<T, keyof T> | T | JSONObject): void;

    /**
     * Get an item or defaultValue if the item does not exist.
     */
    public get<K extends keyof T>(key: K, defaultValue?: JSONValue): T[K];
    public get(key: string, defaultValue?: any): any;

    /**
     * Check if an item exists.
     */
    public has(key: keyof T | string): boolean;

    /**
     * Delete an item.
     */
    public delete(key: keyof T | string): void;

    /**
     * Delete all items.
     */
    public clear(): void;

    /**
     * Watches the given key, calling callback on any changes. When a key is first set oldValue
     * will be undefined, and when a key is deleted newValue will be undefined.
     */
    public onDidChange<K extends keyof T>(
        key: K,
        callback: (newValue: T[K], oldValue: T[K]) => void
    ): void;
    public onDidChange(
        key: string,
        callback: (newValue: JSONValue, oldValue: JSONValue) => void
    ): void;

    /**
     * Get the item count.
     */
    public size: number;

    /**
     * Get all the data as an object or replace the current data with an object.
     */
    public store: T;

    /**
     * Get the path to the storage file.
     */
    public path: string;

    /**
     * Open the storage file in the user's editor.
     */
    public openInEditor(): void;

    public [Symbol.iterator](): Iterator<[string, JSONValue]>;
}
