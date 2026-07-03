# Como Gerar o AAB (Android App Bundle)

## ✅ Configurações Atualizadas

O projeto já está configurado com:
- **targetSdk**: 35 (conforme exigido pelo Google Play)
- **compileSdk**: 35
- **versionCode**: 46
- **versionName**: "1.4.7"

## 📦 Gerando o AAB

### Opção 1: Via Gradle (Local)

```bash
cd android
.\gradlew.bat bundleRelease
```

O arquivo AAB será gerado em:
```
android/app/build/outputs/bundle/release/app-release.aab
```

### Opção 2: Via EAS Build (Recomendado para CI/CD)

```bash
eas build --platform android --profile production
```

## 🔑 Assinatura do App

O app está atualmente configurado para usar o **debug.keystore** na release.

### ⚠️ IMPORTANTE para Produção:

Você precisa configurar uma keystore de produção. No arquivo `android/app/build.gradle`, atualize:

```gradle
signingConfigs {
    release {
        storeFile file('seu-arquivo.keystore')
        storePassword 'sua-senha'
        keyAlias 'seu-alias'
        keyPassword 'sua-senha-key'
    }
}

buildTypes {
    release {
        signingConfig signingConfigs.release  // Usar release ao invés de debug
        // ...
    }
}
```

## 📱 Upload para Google Play

1. Acesse [Google Play Console](https://play.google.com/console)
2. Selecione seu app
3. Vá em **Produção** > **Criar nova versão**
4. Faça upload do arquivo `app-release.aab`
5. Preencha as notas de versão
6. Revise e publique

## ✨ Próximos Passos

- [ ] Configurar keystore de produção
- [ ] Testar o AAB localmente antes do upload
- [ ] Configurar obfuscação/minificação (se necessário)
- [ ] Configurar assinatura automática no EAS

## 🐛 Troubleshooting

**Build muito lento?**
- Use `.\gradlew.bat clean` antes do build
- Feche outras aplicações pesadas
- O primeiro build sempre demora mais

**Erro de assinatura?**
- Verifique se a keystore existe no caminho especificado
- Confirme se as senhas estão corretas
- Para produção, NUNCA use debug.keystore
