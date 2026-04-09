import { Platform } from 'react-native';

// Web usa localStorage, nativo usa AsyncStorage
const storage = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      try { return localStorage.getItem(key); } catch { return null; }
    }
    const AS = require('@react-native-async-storage/async-storage').default;
    return AS.getItem(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      try { localStorage.setItem(key, value); } catch {}
      return;
    }
    const AS = require('@react-native-async-storage/async-storage').default;
    return AS.setItem(key, value);
  },
};

export default storage;
