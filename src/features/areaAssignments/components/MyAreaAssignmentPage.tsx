'use client';

import dynamic from 'next/dynamic';
import { FC, useState } from 'react';
import { Avatar, Box, IconButton, Typography } from '@mui/material';
import { Menu } from '@mui/icons-material';

import useOrganization from 'features/organizations/hooks/useOrganization';
import ZUIFutures from 'zui/ZUIFutures';
import useServerSide from 'core/useServerSide';
import useMyAreaAssignments from '../hooks/useMyAreaAssignments';
import { AssignmentWithAreas } from '../types';
import AreaAssigneeSidebar from './AreaAssigneeSidebar';

const AreaAssignmentMap = dynamic(() => import('./AreaAssignmentMap'), {
  ssr: false,
});

const AssignmentPage: FC<{ assignment: AssignmentWithAreas }> = ({
  assignment,
}) => {
  const orgFuture = useOrganization(assignment.organization.id);
  const isServer = useServerSide();
  const [showMenu, setShowMenu] = useState(false);

  if (isServer) {
    return null;
  }
  return (
    <ZUIFutures futures={{ org: orgFuture }}>
      {({ data: { org } }) => (
        <Box
          sx={{
            height: '100dvh',
            left: 0,
            overflow: 'hidden',
            position: 'absolute',
            right: 0,
            top: 0,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100dvh',
              left: showMenu ? '-90vw' : 0,
              position: 'absolute',
              transition: 'left 0.3s',
              width: '100vw',
            }}
          >
            <Box
              alignItems="center"
              display="flex"
              gap={1}
              justifyContent="space-between"
              padding={2}
            >
              <Box>
                <Box display="flex" flexDirection="column">
                  <Typography variant="body1">
                    {assignment.title ?? 'Untitled areaassignment'}
                  </Typography>
                </Box>
                <Box alignItems="center" display="flex" gap={1}>
                  <Avatar
                    src={`/api/orgs/${org.id}/avatar`}
                    sx={{ height: 24, width: 24 }}
                  />
                  <Typography variant="body2">{org.title}</Typography>
                </Box>
              </Box>
              <Box>
                <IconButton onClick={() => setShowMenu(!showMenu)}>
                  <Menu />
                </IconButton>
              </Box>
            </Box>
            <Box flexGrow={1}>
              <AreaAssignmentMap
                areas={assignment.areas}
                assignment={assignment}
              />
            </Box>
            <Box
              onClick={() => setShowMenu(false)}
              sx={{
                bgcolor: 'black',
                bottom: 0,
                left: 0,
                opacity: showMenu ? 0.2 : 0,
                pointerEvents: showMenu ? 'auto' : 'none',
                position: 'absolute',
                right: 0,
                top: 0,
                transition: 'opacity 0.2s',
                zIndex: 999999,
              }}
            />
          </Box>
          <Box
            sx={{
              bottom: 0,
              left: showMenu ? '10vw' : '100vw',
              position: 'absolute',
              top: 0,
              transition: 'left 0.3s',
              width: '90vw',
              zIndex: 99999,
            }}
          >
            <AreaAssigneeSidebar assignment={assignment} />
          </Box>
        </Box>
      )}
    </ZUIFutures>
  );
};

type MyAreaAssignmentPageProps = {
  areaAssId: string;
};

const MyAreaAssignmentPage: FC<MyAreaAssignmentPageProps> = ({ areaAssId }) => {
  const myAssignments = useMyAreaAssignments();
  const assignment = myAssignments.find(
    (assignment) => assignment.id == areaAssId
  );

  if (!assignment) {
    return null;
  }

  return <AssignmentPage assignment={assignment} />;
};

export default MyAreaAssignmentPage;
