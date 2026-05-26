const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Expo SDK 53+: Firebase @firebase/auth package.json "exports" break Metro on native.
// https://github.com/expo/expo/issues/36375
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
