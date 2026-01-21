module.exports = {
  /**
   * Block cross-origin requests during development.
   *
   * Without this, when running next dev, malicious website can:
   * - Initiate a WebSocket connection to localhost and interact
   *   with the local development server, potentially exposing
   *   internal component code.
   * - Inject a <script> tag referencing predictable paths for
   *   development scripts (e.g., /app/page.js), which are then
   *   executed in the attacker's origin.
   *
   * See https://vercel.com/changelog/cve-2025-48068
   */
  allowedDevOrigins: [],

  experimental: {
    turbo: {
      resolveAlias: {
        canvas: 'util',
      },
    },
    serverComponentsExternalPackages: ['mjml', 'mongoose'],
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
        source: '/storybook',
        destination: '/storybook/index.html',
        permanent: true,
      },
      {
        source: '/docs',
        destination: '/docs/index.html',
        permanent: true,
      },
      {
        source: '/my',
        destination: '/my/home',
        permanent: false,
      },
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
        source: '/organize/:orgId(\\d{1,})',
        destination: '/legacy?orgId=:orgId',
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
      {
        source: '/organize/:orgId/campaigns/:path*',
        destination: '/organize/:orgId/projects/:path*',
        permanent: false,
      },
      {
        source: '/organize/:orgId/people/views/:path*',
        destination: '/organize/:orgId/people/lists/:path*',
        permanent: false,
      },
    ];
  },
};
