module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json',
        ],
        alias: {
          '@app/elements': './src/components/elements',
          '@app/icons': './src/assets',
          '@app/ui': './src/ui',
          '@app/utils': './src/utils',
          '@app/services': './src/services/services',
          '@app/contexts': './src/contexts',
          '@app/types': './src/types',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
