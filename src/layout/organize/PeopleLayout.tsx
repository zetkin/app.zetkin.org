import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';

import TabbedLayout from './TabbedLayout';

interface PeopleLayoutProps {
  children: React.ReactNode;
}

const PeopleLayout: React.FunctionComponent<PeopleLayoutProps> = ({
  children,
}) => {
  const intl = useIntl();
  const { orgId } = useRouter().query;

  return (
    <TabbedLayout
      baseHref={`/organize/${orgId}/people`}
      defaultTab="/views"
      tabs={[
        {
          href: `/views`,
          messageId: 'layout.organize.people.tabs.views',
        },
      ]}
      title={intl.formatMessage({ id: 'layout.organize.people.title' })}
    >
      {children}
    </TabbedLayout>
  );
};

export default PeopleLayout;
