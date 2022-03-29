import { FunctionComponent } from 'react';
import { useRouter } from 'next/router';

import TabbedLayout from './TabbedLayout';

import MarxistTraining from '../../../playwright/mockData/orgs/KPD/journeys/MarxistTraining';

interface AllJourneysLayoutProps {
  fixedHeight?: boolean;
}

const AllJourneysLayout: FunctionComponent<AllJourneysLayoutProps> = ({
  children,
  fixedHeight,
}) => {
  const { orgId, journeyId } = useRouter().query;

  const journey = MarxistTraining;

  // TODO: make journey title dynamic & localised, based on journey type

  return (
    <TabbedLayout
      baseHref={`/organize/${orgId}/journeys/${journeyId}`}
      defaultTab="/"
      fixedHeight={fixedHeight}
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

export default AllJourneysLayout;
