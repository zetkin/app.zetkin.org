import { FC, PropsWithChildren } from 'react';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';

import HomeThemeProvider from 'features/my/components/HomeThemeProvider';
import PublicEventLayout from 'features/public/layouts/PublicEventLayout';
import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinEvent } from 'utils/types/zetkin';
import { getSeoTags } from 'utils/seoTags';
import { ApiClientError } from 'core/api/errors';
import { getFilteredMessages } from 'i18n/pickMessages';

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

  try {
    const event = await apiClient.get<ZetkinEvent>(
      `/api/orgs/${params.orgId}/actions/${params.eventId}`
    );

    const locale = await getLocale();
    const t = await getTranslations();

    const baseTitle =
      event.title || event.activity?.title || t('feat.events.common.noTitle');

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
        locale: new Intl.Locale(locale).maximize().toString(),
      },
      publisher: event.organization.title,
    };
  } catch (e) {
    if (e instanceof ApiClientError && e.status === 404) {
      notFound();
    }
    throw e;
  }
}

const EventLayout: FC<Props> = async ({ children, params }) => {
  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);
  const messages = await getFilteredMessages(
    'feat.events',
    'feat.organizations',
    'feat.campaigns'
  );

  try {
    const event = await apiClient.get<ZetkinEvent>(
      `/api/orgs/${params.orgId}/actions/${params.eventId}`
    );

    return (
      <NextIntlClientProvider messages={messages}>
        <HomeThemeProvider>
          <PublicEventLayout eventId={event.id} orgId={event.organization.id}>
            {children}
          </PublicEventLayout>
        </HomeThemeProvider>
      </NextIntlClientProvider>
    );
  } catch (e) {
    if (e instanceof ApiClientError && e.status === 404) {
      notFound();
    }
    throw e;
  }
};

export default EventLayout;
