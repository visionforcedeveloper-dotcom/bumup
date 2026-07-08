import { Platform } from 'react-native';

// Usa AsyncStorage em nativo e localStorage na web
let AsyncStorage: any = null;

if (Platform.OS !== 'web') {
  try {
    AsyncStorage = require('@react-native-async-storage/async-storage').default;
  } catch {
    AsyncStorage = null;
  }
}

// In-memory fallback
const memCache: Record<string, string> = {};

const storage = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      try { return localStorage.getItem(key); } catch { return null; }
    }
    if (AsyncStorage) {
      try { return await AsyncStorage.getItem(key); } catch { return null; }
    }
    return memCache[key] ?? null;
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      try { localStorage.setItem(key, value); } catch {}
      return;
    }
    if (AsyncStorage) {
      try { await AsyncStorage.setItem(key, value); } catch {}
      return;
    }
    memCache[key] = value;
  },
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      try { localStorage.removeItem(key); } catch {}
      return;
    }
    if (AsyncStorage) {
      try { await AsyncStorage.removeItem(key); } catch {}
      return;
    }
    delete memCache[key];
  },
};

export default storage;
