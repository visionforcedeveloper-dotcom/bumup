# 🚀 Configuração do RevenueCat - BumUp

## 📋 Passo a Passo

### 1. Criar Conta no RevenueCat

1. Acesse [https://app.revenuecat.com/signup](https://app.revenuecat.com/signup)
2. Crie sua conta gratuita
3. Confirme seu email

### 2. Configurar Projeto

1. No dashboard, clique em **"Create new app"**
2. Nome do app: **BumUp**
3. Selecione a plataforma: **Android** (e iOS se tiver)

### 3. Obter as API Keys

#### Android:
1. No dashboard, vá em **Project Settings** (ícone de engrenagem)
2. Clique na aba **"API Keys"**
3. Copie o **Google Play API Key**
4. Cole no arquivo `src/services/revenueCat.ts`:

```typescript
const API_KEYS = {
  android: 'goog_SuaChaveAqui', // ← COLE AQUI
  ios: 'appl_SuaChaveAqui',
};
```

### 4. Conectar com Google Play Console

1. No RevenueCat, vá em **"Service Credentials"**
2. Clique em **"Google Play"**
3. Siga as instruções para conectar sua conta do Google Play Console:
   - Criar Service Account no Google Cloud Console
   - Fazer download do JSON da chave
   - Fazer upload no RevenueCat

**Documentação oficial:** [https://www.revenuecat.com/docs/creating-play-service-credentials](https://www.revenuecat.com/docs/creating-play-service-credentials)

### 5. Criar Produtos (In-App Purchases)

No Google Play Console:

#### Produto Mensal:
1. Vá em **Monetize → Products → Subscriptions**
2. Clique em **"Create subscription"**
3. Preencha:
   - **Product ID:** `monthly_premium` (use exatamente esse ID)
   - **Name:** Premium Mensal
   - **Description:** Acesso completo ao BumUp Premium por 1 mês
   - **Price:** R$ 27,00
   - **Billing period:** 1 month
   - **Free trial:** 3 days

#### Produto Anual:
1. Clique em **"Create subscription"** novamente
2. Preencha:
   - **Product ID:** `annual_premium` (use exatamente esse ID)
   - **Name:** Premium Anual
   - **Description:** Acesso completo ao BumUp Premium por 1 ano
   - **Price:** R$ 47,00
   - **Billing period:** 1 year
   - **Free trial:** 3 days

### 6. Configurar Produtos no RevenueCat

1. No RevenueCat, vá em **"Products"**
2. Clique em **"Add Product"**
3. Para cada produto:
   - **Product ID:** use o mesmo ID criado no Play Console
   - **Type:** Subscription
   - **Platform:** Google Play Store

### 7. Criar Entitlements

1. No RevenueCat, vá em **"Entitlements"**
2. Clique em **"Create Entitlement"**
3. Preencha:
   - **Name:** `premium`
   - **Description:** Acesso premium completo
4. Associe os produtos criados a este entitlement

### 8. Criar Offering

1. No RevenueCat, vá em **"Offerings"**
2. Clique em **"Create Offering"**
3. Preencha:
   - **Identifier:** `default`
   - **Description:** Oferta padrão
4. Adicione packages:
   - **Package 1:**
     - **Identifier:** `annual`
     - **Product:** annual_premium
     - **Duration:** 1 year
   - **Package 2:**
     - **Identifier:** `monthly`
     - **Product:** monthly_premium
     - **Duration:** 1 month

### 9. Testar a Integração

#### Testar com usuário de teste:

1. No Google Play Console, adicione testers:
   - **Settings → License testing**
   - Adicione emails de teste
2. No RevenueCat:
   - Vá em **"Customer Lists"** → **"Sandbox"**
   - Você verá os testes aparecerem aqui
3. No app, faça uma compra de teste
4. Verifique no RevenueCat se a compra apareceu

### 10. Rebuild do App

Após configurar as API Keys:

```bash
# Limpar e reinstalar dependências
rm -rf node_modules
npm install

# Rebuild Android
npx expo prebuild --clean

# Gerar novo APK
eas build --platform android --profile production
```

## 📱 Uso no App

O PaywallScreen já está configurado para:

- ✅ Carregar produtos do RevenueCat automaticamente
- ✅ Mostrar preços reais dos produtos
- ✅ Processar compras
- ✅ Restaurar compras anteriores
- ✅ Validar acesso premium

## 🔍 Verificar Status Premium

Em qualquer lugar do app, você pode verificar se o usuário tem acesso:

```typescript
import { revenueCatService } from './src/services/revenueCat';

const hasPremium = await revenueCatService.checkPremiumAccess();
if (hasPremium) {
  // Usuário é premium
} else {
  // Usuário é free
}
```

## 🎯 Próximos Passos

1. [ ] Criar conta no RevenueCat
2. [ ] Conectar com Google Play Console
3. [ ] Criar produtos no Play Console
4. [ ] Configurar produtos no RevenueCat
5. [ ] Criar entitlements e offerings
6. [ ] Atualizar API keys no código
7. [ ] Testar compras
8. [ ] Fazer build e testar no dispositivo real

## 📚 Recursos

- [Documentação RevenueCat](https://www.revenuecat.com/docs)
- [Google Play Subscriptions](https://developer.android.com/google/play/billing/subscriptions)
- [RevenueCat React Native](https://www.revenuecat.com/docs/getting-started/installation/reactnative)

## 💡 Dicas

- Use o **modo sandbox** para testes (automático em builds de desenvolvimento)
- Teste com contas Google reais em dispositivos reais (emulador pode ter problemas)
- Aguarde até 24h para produtos aparecerem no Play Console após criação
- Use o **RevenueCat Debugger** para monitorar compras em tempo real

## ⚠️ Importante

- Nunca commite as API keys no Git (já estão no .gitignore)
- Use variáveis de ambiente para produção
- Configure webhooks do RevenueCat para sincronizar com seu backend (se tiver)
