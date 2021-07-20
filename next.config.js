const withPlugins = require('next-compose-plugins')
const withCSS = require('@zeit/next-css')

module.exports = withPlugins([withCSS], {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    return config;
    },
    async redirects() {
        return [
            {
                source: '/:prevPath*/calendar/events',
                destination: '/:prevPath*/calendar', 
                permanent: false,
            },
            {
                source: '/:prevPath*/calendar/tasks',
                destination: '/:prevPath*/calendar', 
                permanent: false,
            },
        ]
      },
});
