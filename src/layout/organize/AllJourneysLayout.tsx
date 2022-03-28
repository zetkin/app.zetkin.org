import { FunctionComponent } from 'react';
import { useRouter } from 'next/router';

import TabbedLayout from './TabbedLayout';

interface AllJourneysLayoutProps {
  fixedHeight?: boolean;
}

const AllJourneysLayout: FunctionComponent<AllJourneysLayoutProps> = ({
  children,
  fixedHeight,
}) => {
  const { orgId, journeyTypeId } = useRouter().query;

  // TODO: make journey title dynamic & localised, based on journey type

  return (
    <TabbedLayout
      baseHref={`/organize/${orgId}/journeys/${journeyTypeId}`}
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
      title={journeyTypeId?.toString()}
    >
      {children}
    </TabbedLayout>
  );
};

export default AllJourneysLayout;
