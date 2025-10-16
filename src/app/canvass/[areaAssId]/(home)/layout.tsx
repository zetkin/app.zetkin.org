import { FC, PropsWithChildren } from 'react';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import HomeThemeProvider from 'features/home/components/HomeThemeProvider';
import BackendApiClient from 'core/api/client/BackendApiClient';
import { getBrowserLanguage, getMessages } from 'utils/locale';
import { ZetkinAreaAssignment } from 'features/areaAssignments/types';
import { PublicCanvassLayout } from 'features/organizations/layouts/PublicCanvassLayout';

type Props = PropsWithChildren<{
  params: {
    areaAssId: number;
    areaId: number | undefined;
  };
}>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  const assignments = await apiClient.get<ZetkinAreaAssignment[]>(
    '/api2/users/me/area_assignments'
  );
  const assignment = assignments.find(
    (assignment) => assignment.id == params.areaAssId
  );
  if (!assignment) {
    notFound();
  }

  const lang = getBrowserLanguage(headers().get('accept-language') || '');
  const messages = await getMessages(lang);

  return {
    icons: [{ url: '/logo-zetkin.png' }],
    title: assignment.title || messages['feat.events.common.noTitle'],
  };
}

// @ts-expect-error https://nextjs.org/docs/app/building-your-application/configuring/typescript#async-server-component-typescript-error
const CanvassLayout: FC<Props> = ({ children, params }) => {
  return (
    <HomeThemeProvider>
      <PublicCanvassLayout areaAssId={params.areaAssId}>
        {children}
      </PublicCanvassLayout>
    </HomeThemeProvider>
  );
};

export default CanvassLayout;
