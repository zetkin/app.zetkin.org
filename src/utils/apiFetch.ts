import { IncomingHttpHeaders } from 'node:http';

export type ApiFetch = (path: string, init?: RequestInit) => Promise<Response>;

export const createApiFetch = (
  headers: IncomingHttpHeaders,
  prefix = '/api'
): ApiFetch => {
  return (path, init) => {
    const protocol = process.env.ZETKIN_APP_PROTOCOL || 'http';
    const host =
      headers.host || process.env.ZETKIN_APP_HOST || 'localhost:3000';
    const apiUrl = `${protocol}://${host}${prefix}${path}`;

    return fetch(apiUrl, {
      ...init,
      headers: {
        cookie: headers.cookie || '',
        ...init?.headers,
      },
    });
  };
};
