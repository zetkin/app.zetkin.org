import { FunctionComponent } from 'react';
import { useRouter } from 'next/router';

import { journeyResource } from 'features/journeys/api/journeys';
import TabbedLayout from '../../../utils/layout/TabbedLayout';
import { useMessages } from 'core/i18n';

import messageIds from '../l10n/messageIds';

interface LayoutProps {
  children: React.ReactNode;
  fixedHeight?: boolean;
}

const AllJourneyInstancesLayout: FunctionComponent<LayoutProps> = ({
  children,
  fixedHeight,
}) => {
  const messages = useMessages(messageIds);
  const { orgId, journeyId } = useRouter().query;
  const journeyQuery = journeyResource(
    orgId as string,
    journeyId as string
  ).useQuery();
  const journey = journeyQuery.data;

  return (
    <TabbedLayout
      baseHref={`/organize/${orgId}/journeys/${journeyId}`}
      defaultTab="/"
      ellipsisMenuItems={[
        {
          label: messages.instances.menu.downloadCsv({
            pluralLabel: journey?.plural_label ?? '',
          }),
          onSelect: () => {
            location.href = `/api/journeyInstances/download?orgId=${orgId}&journeyId=${journeyId}`;
          },
        },
        {
          label: messages.instances.menu.downloadXlsx({
            pluralLabel: journey?.plural_label ?? '',
          }),
          onSelect: () => {
            location.href = `/api/journeyInstances/download?orgId=${orgId}&journeyId=${journeyId}&format=xlsx`;
          },
        },
      ]}
      fixedHeight={fixedHeight}
      noPad
      tabs={[
        { href: `/`, label: messages.journeys.tabs.open() },
        { href: `/closed`, label: messages.journeys.tabs.closed() },
        {
          href: `/manage`,
          label: messages.journeys.tabs.manage(),
          tabProps: { disabled: true },
        },
      ]}
      title={journey?.plural_label ?? ''}
    >
      {children}
    </TabbedLayout>
  );
};

export default AllJourneyInstancesLayout;
