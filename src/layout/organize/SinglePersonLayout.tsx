import { FunctionComponent } from 'react';
import { useRouter } from 'next/router';

import { personResource } from 'api/people';
import TabbedLayout from './TabbedLayout';

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

  if (!person) return null;

  return (
    <TabbedLayout
      avatar={`/api/orgs/${orgId}/people/${personId}/avatar`}
      baseHref={`/organize/${orgId}/people/${personId}`}
      defaultTab="/"
      fixedHeight={fixedHeight}
      tabs={[
        { href: `/`, messageId: 'layout.organize.person.tabs.profile' },
        {
          href: `/timeline`,
          messageId: 'layout.organize.person.tabs.timeline',
          tabProps: { disabled: true },
        },
        {
          href: `/manage`,
          messageId: 'layout.organize.person.tabs.manage',
        },
      ]}
      title={`${person?.first_name} ${person?.last_name}`}
    >
      {children}
    </TabbedLayout>
  );
};

export default SinglePersonLayout;
