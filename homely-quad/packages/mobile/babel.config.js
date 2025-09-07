module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@homely-quad/shared': '../shared/src',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
