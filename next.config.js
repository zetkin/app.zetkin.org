module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/:slug*',
        destination: 'https://api.zetk.in/v1/:slug*',
      },
    ]
  },
};
