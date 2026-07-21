'use client';

import { FC } from 'react';
import { Box, Fade } from '@mui/material';

import MyOrgsListItem from './MyOrgsListItem';
import { useUserMembershipsFuture } from 'features/public/hooks/useUserMemberships';
import useIncrementalDelay from 'features/public/hooks/useIncrementalDelay';
import LoadingIndicator from './LoadingIndicator';

const MyOrgsList: FC = () => {
  const membershipsFuture = useUserMembershipsFuture();
  const nextDelay = useIncrementalDelay();

  if (membershipsFuture.isLoading) {
    return <LoadingIndicator />;
  }

  const sortedMemberships = (membershipsFuture.data || []).sort((m0, m1) =>
    m0.organization.title.localeCompare(m1.organization.title)
  );

  return (
    <Box display="flex" flexDirection="column" gap={1} m={1}>
      {sortedMemberships.map((membership) => (
        <Fade
          key={membership.organization.id}
          appear
          in
          style={{
            transitionDelay: nextDelay(),
          }}
        >
          <Box>
            <MyOrgsListItem membership={membership} />
          </Box>
        </Fade>
      ))}
    </Box>
  );
};

export default MyOrgsList;
