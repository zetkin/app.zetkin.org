import { FunctionComponent } from 'react';
import { useRouter } from 'next/router';

import { personResource } from 'features/profile/api/people';
import TabbedLayout from '../../../utils/layout/TabbedLayout';
import { Box, Typography } from '@material-ui/core';

interface SinglePersonLayoutProps {
  children: React.ReactNode;
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

  if (!person) {
    return null;
  }

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
      title={
        <Box
          style={{
            alignItems: 'center',
            display: 'flex',
          }}
        >
          {`${person?.first_name} ${person?.last_name}`}
          {person?.ext_id && (
            <Typography
              color="secondary"
              variant="h3"
            >{`\u00A0#${person?.ext_id}`}</Typography>
          )}
        </Box>
      }
    >
      {children}
    </TabbedLayout>
  );
};

export default SinglePersonLayout;
