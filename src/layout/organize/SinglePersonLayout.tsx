import { FunctionComponent } from 'react';
import { useRouter } from 'next/router';

import { personResource } from 'api/people';
import TabbedLayout from './TabbedLayout';
import { useIntl } from 'react-intl';

interface SinglePersonLayoutProps {
  fixedHeight?: boolean;
}

const SinglePersonLayout: FunctionComponent<SinglePersonLayoutProps> = ({
  children,
  fixedHeight,
}) => {
  const { orgId, personId } = useRouter().query;
  const { data: person } = personResource(
    orgId as string,
    personId as string
  ).useQuery();
  const intl = useIntl();

  if (!person) return null;

  return (
    <TabbedLayout
      avatar={`/api/orgs/${orgId}/people/${personId}/avatar`}
      baseHref={`/organize/${orgId}/people/${personId}`}
      defaultTab="/"
      fixedHeight={fixedHeight}
      subtitle={intl.formatMessage(
        { id: 'layout.organize.person.subtitle' },
        { year: '20xx' }
      )}
      tabs={[
        { href: `/`, messageId: 'layout.organize.person.tabs.profile' },
        {
          href: `/timeline`,
          messageId: 'layout.organize.person.tabs.timeline',
          tabProps: { disabled: true },
        },
      ]}
      title={`${person?.first_name} ${person?.last_name}`}
    >
      {children}
    </TabbedLayout>
  );
};

export default SinglePersonLayout;
