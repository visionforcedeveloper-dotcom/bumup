import Purchases, {
  PurchasesPackage,
  CustomerInfo,
  PurchasesOfferings,
} from 'react-native-purchases';
import { Platform } from 'react-native';

// Chaves da API do RevenueCat
const API_KEYS = {
  android: 'SEU_ANDROID_API_KEY_AQUI', // Substitua pela sua chave Android
  ios: 'SEU_IOS_API_KEY_AQUI', // Substitua pela sua chave iOS
};

class RevenueCatService {
  private initialized = false;

  /**
   * Inicializa o RevenueCat SDK
   * Chame isso no App.tsx assim que o app carregar
   */
  async initialize(userId?: string): Promise<void> {
    if (this.initialized) return;

    try {
      const apiKey = Platform.select({
        android: API_KEYS.android,
        ios: API_KEYS.ios,
        default: API_KEYS.android,
      });

      if (!apiKey || apiKey.includes('SEU_')) {
        console.warn('⚠️ RevenueCat API Key não configurada!');
        return;
      }

      // Configurar SDK
      Purchases.configure({ apiKey });

      // Definir usuário se fornecido
      if (userId) {
        await Purchases.logIn(userId);
      }

      // Habilitar logs em desenvolvimento
      if (__DEV__) {
        Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
      }

      this.initialized = true;
      console.log('✅ RevenueCat inicializado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao inicializar RevenueCat:', error);
      throw error;
    }
  }

  /**
   * Busca as ofertas/produtos disponíveis
   */
  async getOfferings(): Promise<PurchasesOfferings | null> {
    try {
      const offerings = await Purchases.getOfferings();
      return offerings;
    } catch (error) {
      console.error('❌ Erro ao buscar offerings:', error);
      return null;
    }
  }

  /**
   * Realiza a compra de um pacote
   */
  async purchasePackage(pkg: PurchasesPackage): Promise<{
    customerInfo: CustomerInfo;
    success: boolean;
  }> {
    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      return {
        customerInfo,
        success: true,
      };
    } catch (error: any) {
      // Usuário cancelou
      if (error.userCancelled) {
        console.log('ℹ️ Compra cancelada pelo usuário');
        return { customerInfo: error.customerInfo, success: false };
      }

      console.error('❌ Erro na compra:', error);
      throw error;
    }
  }

  /**
   * Restaura compras anteriores
   */
  async restorePurchases(): Promise<CustomerInfo> {
    try {
      const customerInfo = await Purchases.restorePurchases();
      console.log('✅ Compras restauradas com sucesso');
      return customerInfo;
    } catch (error) {
      console.error('❌ Erro ao restaurar compras:', error);
      throw error;
    }
  }

  /**
   * Verifica se o usuário tem acesso premium
   */
  async checkPremiumAccess(): Promise<boolean> {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      
      // Verifica se tem algum entitlement ativo
      // Ajuste o nome do entitlement conforme configurado no RevenueCat
      const hasPremium =
        typeof customerInfo.entitlements.active['premium'] !== 'undefined';

      return hasPremium;
    } catch (error) {
      console.error('❌ Erro ao verificar acesso premium:', error);
      return false;
    }
  }

  /**
   * Obtém informações do cliente
   */
  async getCustomerInfo(): Promise<CustomerInfo | null> {
    try {
      return await Purchases.getCustomerInfo();
    } catch (error) {
      console.error('❌ Erro ao obter customer info:', error);
      return null;
    }
  }

  /**
   * Define atributos do usuário para analytics
   */
  async setUserAttributes(attributes: Record<string, string | null>): Promise<void> {
    try {
      await Purchases.setAttributes(attributes);
    } catch (error) {
      console.error('❌ Erro ao definir atributos:', error);
    }
  }

  /**
   * Faz logout do usuário atual
   */
  async logout(): Promise<void> {
    try {
      await Purchases.logOut();
      console.log('✅ Logout realizado');
    } catch (error) {
      console.error('❌ Erro no logout:', error);
    }
  }
}

export const revenueCatService = new RevenueCatService();
