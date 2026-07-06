import { Platform } from 'react-native';

// Chaves da API do RevenueCat
const API_KEYS = {
  android: 'goog_tZYuFAVPqUIRvesnclpVcyZtcoJ',
  ios: 'SEU_IOS_API_KEY_AQUI',
};

// Mock para Expo Go (não suporta módulos nativos)
const isMockMode = __DEV__;

class RevenueCatService {
  private initialized = false;

  async initialize(userId?: string): Promise<void> {
    if (this.initialized) return;
    if (isMockMode) {
      this.initialized = true;
      return;
    }

    try {
      const Purchases = require('react-native-purchases').default;

      const apiKey = Platform.select({
        android: API_KEYS.android,
        ios: API_KEYS.ios,
        default: API_KEYS.android,
      });

      Purchases.configure({ apiKey });
      if (userId) await Purchases.logIn(userId);
      this.initialized = true;
    } catch (error) {
      console.error('❌ Erro ao inicializar RevenueCat:', error);
    }
  }

  async getOfferings(): Promise<any> {
    if (isMockMode) return null;
    try {
      const Purchases = require('react-native-purchases').default;
      return await Purchases.getOfferings();
    } catch {
      return null;
    }
  }

  async purchasePackage(pkg: any): Promise<{ customerInfo: any; success: boolean }> {
    if (isMockMode) {
      return { customerInfo: {}, success: true };
    }
    try {
      const Purchases = require('react-native-purchases').default;
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      return { customerInfo, success: true };
    } catch (error: any) {
      if (error.userCancelled) {
        return { customerInfo: error.customerInfo, success: false };
      }
      throw error;
    }
  }

  async restorePurchases(): Promise<any> {
    if (isMockMode) return { entitlements: { active: {} } };
    try {
      const Purchases = require('react-native-purchases').default;
      return await Purchases.restorePurchases();
    } catch (error) {
      throw error;
    }
  }

  async checkPremiumAccess(): Promise<boolean> {
    if (isMockMode) return false;
    try {
      const Purchases = require('react-native-purchases').default;
      const customerInfo = await Purchases.getCustomerInfo();
      return typeof customerInfo.entitlements.active['premium'] !== 'undefined';
    } catch {
      return false;
    }
  }

  async getCustomerInfo(): Promise<any> {
    if (isMockMode) return null;
    try {
      const Purchases = require('react-native-purchases').default;
      return await Purchases.getCustomerInfo();
    } catch {
      return null;
    }
  }

  async setUserAttributes(attributes: Record<string, string | null>): Promise<void> {
    if (isMockMode) return;
    try {
      const Purchases = require('react-native-purchases').default;
      await Purchases.setAttributes(attributes);
    } catch {}
  }

  async logout(): Promise<void> {
    if (isMockMode) return;
    try {
      const Purchases = require('react-native-purchases').default;
      await Purchases.logOut();
    } catch {}
  }
}

export const revenueCatService = new RevenueCatService();
