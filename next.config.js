module.exports = {
  experimental: {
    serverActions: {
      allowedOrigins: [],
    },
  },
  images: {
    domains: [
      `files.${process.env.ZETKIN_API_DOMAIN}`,

      // localhost added for playwright testing
      'localhost',
    ],
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
      {
        source: `/organize/:orgId/people/views`,
        destination: '/organize/:orgId/people',
        permanent: true,
      },
      {
        source: `/organize/:orgId`,
        destination: '/organize/:orgId/projects',
        permanent: false,
      },
      // redirects to Gen2 for MVP August 2021
      {
        source: '/organize/:orgId/people/:personId/edit',
        destination: `http://organize.${process.env.ZETKIN_API_DOMAIN}/people/person%3A:personId/?org=:orgId`,
        permanent: false,
      },
      {
        source: '/organize/:orgId(\\d{1,})',
        destination: '/legacy?orgId=:orgId',
        permanent: false,
      },
      {
        source: '/organize/:orgId(\\d{1,})/areas',
        destination: '/legacy?path=/maps&orgId=:orgId',
        permanent: false,
      },
      {
        source:
          '/organize/:orgId(\\d{1,})/projects/calendar/events/:eventId(\\d{1,})',
        destination: '/legacy?path=/campaign/action%3A:eventId&orgId=:orgId',
        permanent: false,
      },
      {
        source:
          '/organize/:orgId(\\d{1,})/projects/:campId(\\d{1,})/calendar/events/:eventId(\\d{1,})',
        destination: '/legacy?path=/campaign/action%3A:eventId&orgId=:orgId',
        permanent: false,
      },
    ];
  },
};
