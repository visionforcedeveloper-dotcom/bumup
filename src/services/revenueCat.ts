// RevenueCat — mock completo (pacote nativo removido para compatibilidade com Expo Go)
// Reativar instalando react-native-purchases para builds de produção

class RevenueCatService {
  async initialize(_userId?: string): Promise<void> {}
  async getOfferings(): Promise<any> { return null; }
  async purchasePackage(_pkg: any): Promise<{ customerInfo: any; success: boolean }> {
    return { customerInfo: {}, success: true };
  }
  async restorePurchases(): Promise<any> { return { entitlements: { active: {} } }; }
  async checkPremiumAccess(): Promise<boolean> { return false; }
  async getCustomerInfo(): Promise<any> { return null; }
  async setUserAttributes(_attrs: Record<string, string | null>): Promise<void> {}
  async logout(): Promise<void> {}
}

export const revenueCatService = new RevenueCatService();
