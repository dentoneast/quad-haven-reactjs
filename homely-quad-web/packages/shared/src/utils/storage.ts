// Platform-agnostic storage utilities
export interface StorageInterface {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}

// Web storage implementation
class WebStorage implements StorageInterface {
  private storage: Storage;

  constructor(storage: Storage) {
    this.storage = storage;
  }

  getItem(key: string): string | null {
    try {
      return this.storage.getItem(key);
    } catch (error) {
      console.warn(`Failed to get item ${key}:`, error);
      return null;
    }
  }

  setItem(key: string, value: string): void {
    try {
      this.storage.setItem(key, value);
    } catch (error) {
      console.warn(`Failed to set item ${key}:`, error);
    }
  }

  removeItem(key: string): void {
    try {
      this.storage.removeItem(key);
    } catch (error) {
      console.warn(`Failed to remove item ${key}:`, error);
    }
  }

  clear(): void {
    try {
      this.storage.clear();
    } catch (error) {
      console.warn('Failed to clear storage:', error);
    }
  }
}

// React Native AsyncStorage implementation
class AsyncStorage implements StorageInterface {
  private storage: any;

  constructor() {
    // This would be imported from @react-native-async-storage/async-storage
    // For now, we'll use a mock implementation
    this.storage = {
      getItem: async (key: string) => null,
      setItem: async (key: string, value: string) => {},
      removeItem: async (key: string) => {},
      clear: async () => {},
    };
  }

  getItem(key: string): string | null {
    // In a real implementation, this would be async
    return null;
  }

  setItem(key: string, value: string): void {
    // In a real implementation, this would be async
  }

  removeItem(key: string): void {
    // In a real implementation, this would be async
  }

  clear(): void {
    // In a real implementation, this would be async
  }
}

// Storage factory
export function createStorage(): StorageInterface {
  if (typeof window !== 'undefined' && window.localStorage) {
    return new WebStorage(window.localStorage);
  }
  
  // Fallback for React Native or other environments
  return new AsyncStorage();
}

// Default storage instance
export const storage = createStorage();

// Typed storage utilities
export class TypedStorage<T> {
  private key: string;
  private storage: StorageInterface;

  constructor(key: string, storageInstance: StorageInterface = storage) {
    this.key = key;
    this.storage = storageInstance;
  }

  get(): T | null {
    try {
      const item = this.storage.getItem(this.key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn(`Failed to get typed storage item ${this.key}:`, error);
      return null;
    }
  }

  set(value: T): void {
    try {
      this.storage.setItem(this.key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Failed to set typed storage item ${this.key}:`, error);
    }
  }

  remove(): void {
    this.storage.removeItem(this.key);
  }

  has(): boolean {
    return this.get() !== null;
  }
}

// Common storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
  SETTINGS: 'settings',
} as const;

// Pre-configured typed storage instances
export const authStorage = new TypedStorage<{ token: string; refreshToken: string }>(STORAGE_KEYS.AUTH_TOKEN);
export const userStorage = new TypedStorage<any>(STORAGE_KEYS.USER);
export const themeStorage = new TypedStorage<string>(STORAGE_KEYS.THEME);
export const settingsStorage = new TypedStorage<Record<string, any>>(STORAGE_KEYS.SETTINGS);
