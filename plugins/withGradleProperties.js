const { withGradleProperties } = require('@expo/config-plugins');

module.exports = function withFixGradleProperties(config) {
  return withGradleProperties(config, (config) => {
    const props = config.modResults;

    const set = (key, value) => {
      const idx = props.findIndex(p => p.type === 'property' && p.key === key);
      if (idx >= 0) {
        props[idx].value = value;
      } else {
        props.push({ type: 'property', key, value });
      }
    };

    // React Native 0.81+ requires New Architecture
    set('newArchEnabled', 'true');

    // Required for native libs to load correctly from Play Store AAB splits
    set('expo.useLegacyPackaging', 'true');

    return config;
  });
};
