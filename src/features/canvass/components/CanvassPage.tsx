'use client';

import { FC, Suspense, useState } from 'react';
import { Avatar, Box, IconButton, Typography } from '@mui/material';
import { Menu } from '@mui/icons-material';
import { ArrowLeftIcon } from '@mui/x-date-pickers';
import { notFound, useRouter } from 'next/navigation';

import useOrganization from 'features/organizations/hooks/useOrganization';
import ZUIFutures from 'zui/ZUIFutures';
import useServerSide from 'core/useServerSide';
import useMyAreaAssignments from '../hooks/useMyAreaAssignments';
import CanvassSidebar from './CanvassSidebar';
import { ZetkinAreaAssignment } from 'features/areaAssignments/types';
import useAssignmentAreas from 'features/areaAssignments/hooks/useAssignmentAreas';
import GLCanvassMap from './GLCanvassMap';

const Page: FC<{ areaId: number; assignment: ZetkinAreaAssignment }> = ({
  areaId,
  assignment,
}) => {
  const areas = useAssignmentAreas(assignment.organization_id, assignment.id);
  const orgFuture = useOrganization(assignment.organization_id);
  const selectedArea = areas.find((area) => area.id == areaId);
  const router = useRouter();
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
              justifyContent="space-between"
              py={2}
            >
              <Box display="flex">
                <ArrowLeftIcon
                  fontSize="large"
                  onClick={() => router.push(`/canvass/${assignment.id}/areas`)}
                  sx={{ alignSelf: 'center', cursor: 'pointer', mr: 1 }}
                />
                <Box
                  alignItems="flex-start"
                  display="flex"
                  flexDirection="column"
                >
                  <Typography variant="body1">{assignment.title}</Typography>
                  <Box alignItems="center" display="flex" gap={1}>
                    <Avatar
                      src={`/api/orgs/${org.id}/avatar`}
                      sx={{ height: 24, width: 24 }}
                    />
                    <Typography variant="body2">{org.title}</Typography>
                  </Box>
                </Box>
              </Box>
              <IconButton onClick={() => setShowMenu(!showMenu)}>
                <Menu />
              </IconButton>
            </Box>
            <Box flexGrow={1} sx={{ height: '200px' }}>
              {selectedArea && (
                <GLCanvassMap
                  assignment={assignment}
                  selectedArea={selectedArea}
                />
              )}
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
            {selectedArea && (
              <CanvassSidebar
                assignment={assignment}
                selectedArea={selectedArea}
              />
            )}
          </Box>
        </Box>
      )}
    </ZUIFutures>
  );
};

type CanvassPageProps = {
  areaAssId: number;
  areaId: number;
};

const CanvassPage: FC<CanvassPageProps> = ({ areaAssId, areaId }) => {
  const myAssignments = useMyAreaAssignments();
  const assignment = myAssignments.find(
    (assignment) => assignment.id == areaAssId
  );

  if (!assignment) {
    notFound();
  }

  return (
    <Suspense>
      <Page areaId={areaId} assignment={assignment} />
    </Suspense>
  );
};

export default CanvassPage;
