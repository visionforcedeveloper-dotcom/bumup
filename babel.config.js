module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // reanimated v4 usa worklets plugin
      'react-native-worklets/plugin',
    ],
  };
};
