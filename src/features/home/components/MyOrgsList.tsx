'use client';

import { FC } from 'react';
import { Box, Fade } from '@mui/material';

import useUserMemberships from '../hooks/useUserMemberships';
import useIncrementalDelay from '../hooks/useIncrementalDelay';
import MyOrgsListItem from './MyOrgsListItem';

const MyOrgsList: FC = () => {
  const memberships = useUserMemberships();
  const nextDelay = useIncrementalDelay();

  const sortedMemberships = memberships.sort((m0, m1) =>
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
