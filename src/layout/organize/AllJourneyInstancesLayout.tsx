import { FunctionComponent } from 'react';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';

import { journeyResource } from 'api/journeys';
import TabbedLayout from './TabbedLayout';

interface LayoutProps {
  fixedHeight?: boolean;
}

const AllJourneyInstancesLayout: FunctionComponent<LayoutProps> = ({
  children,
  fixedHeight,
}) => {
  const intl = useIntl();
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
          label: intl.formatMessage(
            {
              id: 'layout.organize.journeyInstances.menu.downloadCsv',
            },
            { pluralLabel: journey?.plural_label ?? '' }
          ),
          onSelect: () => {
            location.href = `/api/journeyInstances/download?orgId=${orgId}&journeyId=${journeyId}`;
          },
        },
        {
          label: intl.formatMessage(
            {
              id: 'layout.organize.journeyInstances.menu.downloadXlsx',
            },
            { pluralLabel: journey?.plural_label ?? '' }
          ),
          onSelect: () => {
            location.href = `/api/journeyInstances/download?orgId=${orgId}&journeyId=${journeyId}&format=xlsx`;
          },
        },
      ]}
      fixedHeight={fixedHeight}
      noPad
      tabs={[
        { href: `/`, messageId: 'layout.organize.journeys.tabs.open' },
        { href: `/closed`, messageId: 'layout.organize.journeys.tabs.closed' },
        {
          href: `/manage`,
          messageId: 'layout.organize.journeys.tabs.manage',
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
