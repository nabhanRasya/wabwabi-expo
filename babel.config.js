// SDK 56 + NativeWind v4
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // react-native-worklets harus jadi plugin PERTAMA
      "react-native-worklets/plugin",
    ],
  };
};
