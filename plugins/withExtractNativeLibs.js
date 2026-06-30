const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withExtractNativeLibs(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;
    const app = manifest.application[0];

    // Force extractNativeLibs=true so SoLoader can find native libs from Play Store AAB splits
    app.$['android:extractNativeLibs'] = 'true';

    return config;
  });
};
