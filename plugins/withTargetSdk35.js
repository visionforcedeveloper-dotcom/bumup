const { withAppBuildGradle } = require('@expo/config-plugins');

module.exports = function withTargetSdk35(config) {
  return withAppBuildGradle(config, (config) => {
    let gradle = config.modResults.contents;

    // Substituir targetSdkVersion para 35
    gradle = gradle.replace(
      /targetSdkVersion\s*=?\s*\d+/g,
      'targetSdkVersion = 35'
    );

    // Substituir compileSdkVersion para 35
    gradle = gradle.replace(
      /compileSdkVersion\s*=?\s*\d+/g,
      'compileSdkVersion = 35'
    );

    config.modResults.contents = gradle;
    return config;
  });
};
