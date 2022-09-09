import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';

import TabbedLayout from './TabbedLayout';

interface JourneysLayoutProps {
  children: React.ReactNode;
}

const JourneysLayout: React.FunctionComponent<JourneysLayoutProps> = ({
  children,
}) => {
  const intl = useIntl();
  const { orgId } = useRouter().query;

  return (
    <TabbedLayout
      baseHref={`/organize/${orgId}/journeys`}
      defaultTab="/overview"
      ellipsisMenuItems={[
        {
          label: intl.formatMessage({
            id: 'layout.organize.journeys.menu.downloadCsv',
          }),
          onSelect: () => {
            location.href = `/api/journeyInstances/download?orgId=${orgId}`;
          },
        },
        {
          label: intl.formatMessage({
            id: 'layout.organize.journeys.menu.downloadXlsx',
          }),
          onSelect: () => {
            location.href = `/api/journeyInstances/download?orgId=${orgId}&format=xlsx`;
          },
        },
      ]}
      tabs={[
        {
          href: `/overview`,
          messageId: 'layout.organize.journeys.tabs.overview',
        },
      ]}
      title={intl.formatMessage({ id: 'layout.organize.journeys.title' })}
    >
      {children}
    </TabbedLayout>
  );
};

export default JourneysLayout;
