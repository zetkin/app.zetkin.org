import { FunctionComponent } from 'react';

import messageIds from '../l10n/messageIds';
import TabbedLayout from '../../../utils/layout/TabbedLayout';
import useJourney from '../hooks/useJourney';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';

interface LayoutProps {
  children: React.ReactNode;
  fixedHeight?: boolean;
}

const AllJourneyInstancesLayout: FunctionComponent<LayoutProps> = ({
  children,
  fixedHeight,
}) => {
  const messages = useMessages(messageIds);
  const { orgId, journeyId } = useNumericRouteParams();
  const journeyFuture = useJourney(orgId, journeyId);

  return (
    <TabbedLayout
      baseHref={`/organize/${orgId}/journeys/${journeyId}`}
      defaultTab="/"
      ellipsisMenuItems={[
        {
          label: messages.instances.menu.downloadCsv({
            pluralLabel: journeyFuture.data?.plural_label ?? '',
          }),
          onSelect: () => {
            location.href = `/api/journeyInstances/download?orgId=${orgId}&journeyId=${journeyId}`;
          },
        },
        {
          label: messages.instances.menu.downloadXlsx({
            pluralLabel: journeyFuture.data?.plural_label ?? '',
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
      title={journeyFuture.data?.plural_label ?? ''}
    >
      {children}
    </TabbedLayout>
  );
};

export default AllJourneyInstancesLayout;
