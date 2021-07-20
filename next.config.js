const withPlugins = require('next-compose-plugins')

module.exports = withPlugins([], {
  webpack: (config) => {
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
