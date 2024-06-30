const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  staticDirs: ['../src'],
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],

  framework: '@storybook/nextjs',

  webpackFinal: async (config) => {
    config.resolve.plugins = [
      ...(config.resolve.plugins || []),
      new TsconfigPathsPlugin({
        extensions: config.resolve.extensions,
      }),
    ];
    return config;
  },

  typescript: {
    reactDocgen: 'react-docgen-typescript'
  }
};
