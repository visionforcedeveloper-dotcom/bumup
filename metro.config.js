const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Garante que GIFs são tratados como assets
config.resolver.assetExts = [
  ...config.resolver.assetExts.filter((ext) => ext !== 'svg'),
  'gif',
  'png',
  'jpg',
  'jpeg',
  'webp',
];

module.exports = config;
