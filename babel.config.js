// babel.config.js

module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // 다른 플러그인들...
      'react-native-reanimated/plugin', // ✅ 이 줄이 있는지, 그리고 가장 마지막에 있는지 확인하세요!
    ],
  };
};