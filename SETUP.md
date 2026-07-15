# BumUp — Configuração que Funciona

## Versões exatas (não mudar)

| Pacote | Versão |
|--------|--------|
| expo | ~54.0.0 |
| react-native | 0.81.5 |
| react | 19.1.0 |
| react-dom | 19.1.0 |
| react-native-gesture-handler | 2.20.2 |
| react-native-reanimated | 3.16.7 |
| react-native-safe-area-context | ~5.6.0 |
| react-native-screens | ~4.16.0 |
| @react-native-async-storage/async-storage | 2.2.0 |
| @expo/vector-icons | ^15.0.3 |
| expo-linear-gradient | ~15.0.8 |
| expo-status-bar | ~3.0.9 |

## Rodar no Expo Go

```
npx expo start --clear --host lan
```

- PC e celular devem estar na **mesma rede Wi-Fi**
- Expo Go deve ser a versão **SDK 54** (Play Store)
- Se der erro de cache: Configurações → Apps → Expo Go → Armazenamento → Limpar dados

## NUNCA fazer

- `npx expo install --fix` — atualiza pacotes para versões incompatíveis
- Mudar react-native para 0.76+ manualmente — quebra o Expo Go
- Mudar reanimated para 4.x — requer react-native-worklets que não existe no projeto

## Gerar AAB para produção

1. Atualizar versionCode no `app.json` e `android/app/build.gradle`
2. Commit e push
3. `eas build --platform android --profile production --clear-cache`
4. Download em https://expo.dev/accounts/visionforce/projects/bumup-app/builds

## Se o Expo Go parar de funcionar

Restaurar o `package.json` para as versões da tabela acima e rodar:
```
npm install
npx expo start --clear --host lan
```
