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
      subtitle={'Joined 2018'}
      tabs={[
        { href: `/`, messageId: 'Profile' },
        {
          href: `/timeline`,
          messageId: 'Timeline',
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
