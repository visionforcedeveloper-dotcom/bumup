import { Platform } from 'react-native';

// Fallback em memória para web ou quando AsyncStorage não está disponível
const memCache: Record<string, string> = {};

let AsyncStorage: any = null;

// Tenta carregar o AsyncStorage (disponível em builds nativos)
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch {
  AsyncStorage = null;
}

const storage = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      try { return localStorage.getItem(key); } catch { return null; }
    }
    if (AsyncStorage) {
      try { return await AsyncStorage.getItem(key); } catch { return memCache[key] ?? null; }
    }
    return memCache[key] ?? null;
  },

  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      try { localStorage.setItem(key, value); } catch {}
      return;
    }
    memCache[key] = value;
    if (AsyncStorage) {
      try { await AsyncStorage.setItem(key, value); } catch {}
    }
  },

  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      try { localStorage.removeItem(key); } catch {}
      return;
    }
    delete memCache[key];
    if (AsyncStorage) {
      try { await AsyncStorage.removeItem(key); } catch {}
    }
  },
};

export default storage;
