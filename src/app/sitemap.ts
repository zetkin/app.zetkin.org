import { MetadataRoute } from 'next';
import { headers } from 'next/headers';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinOrganization } from 'utils/types/zetkin';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = await headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  const protocol = process.env.ZETKIN_APP_PROTOCOL || 'http';
  const host = process.env.ZETKIN_APP_HOST || 'localhost:3000';
  const baseUrl = `${protocol}://${host}`;

  const orgs = await apiClient
    .get<ZetkinOrganization[]>(`/api/orgs`)
    .catch(() => [] as ZetkinOrganization[]);

  const staticPages = ['', '/my/home', '/my/feed', '/my/settings'].map(
    (path) => ({
      lastModified: new Date(),
      url: `${baseUrl}${path}`,
    })
  );

  return [
    ...staticPages,
    ...orgs.map((o) => ({ url: `${baseUrl}/o/${o.id}` })),
    ...orgs.map((o) => ({ url: `${baseUrl}/sitemaps/o/${o.id}/sitemap.xml` })),
  ];
}
