import { FC, PropsWithChildren } from 'react';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import HomeThemeProvider from 'features/my/components/HomeThemeProvider';
import PublicEventLayout from 'features/public/layouts/PublicEventLayout';
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

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const headersList = await headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  const event = await apiClient.get<ZetkinEvent>(
    `/api/orgs/${params.orgId}/actions/${params.eventId}`
  );

  const lang = getBrowserLanguage(
    (await headers()).get('accept-language') || ''
  );
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

const EventLayout: FC<Props> = async (props) => {
  const params = await props.params;

  const { children } = props;

  const headersList = await headers();
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
