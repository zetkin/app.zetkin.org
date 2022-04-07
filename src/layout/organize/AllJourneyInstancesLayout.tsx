import { FunctionComponent } from 'react';
import { useRouter } from 'next/router';

import { journeyResource } from 'api/journeys';
import TabbedLayout from './TabbedLayout';
import { ZetkinJourney } from 'types/zetkin';

interface LayoutProps {
  fixedHeight?: boolean;
}

const AllJourneyInstancesLayout: FunctionComponent<LayoutProps> = ({
  children,
  fixedHeight,
}) => {
  const { orgId, journeyId } = useRouter().query;
  const journeyQuery = journeyResource(
    orgId as string,
    journeyId as string
  ).useQuery();
  const journey = journeyQuery.data as ZetkinJourney;

  return (
    <TabbedLayout
      baseHref={`/organize/${orgId}/journeys/${journeyId}`}
      defaultTab="/"
      fixedHeight={fixedHeight}
      noPad
      tabs={[
        { href: `/`, messageId: 'layout.organize.journeys.tabs.overview' },
        {
          href: `/manage`,
          messageId: 'layout.organize.journeys.tabs.manage',
          tabProps: { disabled: true },
        },
      ]}
      title={journey.plural_name}
    >
      {children}
    </TabbedLayout>
  );
};

export default AllJourneyInstancesLayout;
