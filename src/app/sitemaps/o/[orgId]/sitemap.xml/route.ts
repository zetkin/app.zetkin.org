import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinCampaign, ZetkinEvent, ZetkinSurvey } from 'utils/types/zetkin';

const getUrlsXml = <T>(ts: T[], urlGen: (t: T) => string) => {
  return ts
    .map(
      (e) =>
        `<url><loc>${urlGen(
          e
        )}</loc><lastmod>${new Date().toISOString()}</lastmod></url>`
    )
    .join('');
};

export async function GET(
  _: Request,
  { params }: { params: { orgId: number } }
) {
  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  const protocol = process.env.ZETKIN_APP_PROTOCOL || 'http';
  const host = process.env.ZETKIN_APP_HOST || 'localhost:3000';
  const baseUrl = `${protocol}://${host}`;

  const [events, projects, surveys] = await Promise.all([
    apiClient
      .get<ZetkinEvent[]>(`/api/orgs/${params.orgId}/actions`)
      .catch(() => [] as ZetkinEvent[]),
    apiClient
      .get<ZetkinCampaign[]>(`/api/orgs/${params.orgId}/campaigns`)
      .catch(() => [] as ZetkinCampaign[]),
    apiClient
      .get<ZetkinSurvey[]>(`/api/orgs/${params.orgId}/surveys`)
      .catch(() => [] as ZetkinSurvey[]),
  ]);

  const urls =
    getUrlsXml(
      [`${baseUrl}/o/${params.orgId}`, `${baseUrl}/o/${params.orgId}/suborgs`],
      (str) => str
    ) +
    getUrlsXml(events, (e) => `${baseUrl}/o/${params.orgId}/events/${e.id}`) +
    getUrlsXml(
      projects,
      (p) => `${baseUrl}/o/${params.orgId}/projects/${p.id}`
    ) +
    getUrlsXml(surveys, (s) => `${baseUrl}/o/${params.orgId}/surveys/${s.id}`);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
