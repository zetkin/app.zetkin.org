import { FC, PropsWithChildren } from 'react';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import HomeThemeProvider from 'features/home/components/HomeThemeProvider';
import PublicEventLayout from 'features/organizations/layouts/PublicEventLayout';
import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinEvent } from 'utils/types/zetkin';
import { getBrowserLanguage, getMessages } from 'utils/locale';
import { getSeoTags } from 'utils/seoTags';

type Props = PropsWithChildren<{
  params: {
    eventId: number;
    orgId: number;
  };
}>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  const event = await apiClient.get<ZetkinEvent>(
    `/api/orgs/${params.orgId}/actions/${params.eventId}`
  );

  const lang = getBrowserLanguage(headers().get('accept-language') || '');
  const messages = await getMessages(lang);

  const baseTitle =
    event.title ||
    event.activity?.title ||
    messages['feat.events.common.noTitle'];

  const baseTags = getSeoTags(
    `${baseTitle} | ${event.organization.title}`,
    event.info_text,
    `/o/${event.organization.id}/events/${event.id}`
  );
  return {
    ...baseTags,
    creator: event.organization.title,
    openGraph: {
      ...baseTags.openGraph,
      images: event.cover_file ? [event.cover_file.url] : undefined,
      locale: new Intl.Locale(lang).maximize().toString(),
    },
    publisher: event.organization.title,
  };
}

// @ts-expect-error https://nextjs.org/docs/app/building-your-application/configuring/typescript#async-server-component-typescript-error
const EventLayout: FC<Props> = async ({ children, params }) => {
  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  try {
    const event = await apiClient.get<ZetkinEvent>(
      `/api/orgs/${params.orgId}/actions/${params.eventId}`
    );

    return (
      <HomeThemeProvider>
        <PublicEventLayout eventId={event.id} orgId={event.organization.id}>
          {children}
        </PublicEventLayout>
      </HomeThemeProvider>
    );
  } catch {
    return notFound();
  }
};

export default EventLayout;
