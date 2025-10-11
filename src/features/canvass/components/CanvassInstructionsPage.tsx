'use client';

import { FC } from 'react';
import { HomeWork } from '@mui/icons-material';
import { Avatar, Box, Button, Card, Divider, Typography } from '@mui/material';

import useMyCanvassAssignments from '../hooks/useMyAreaAssignments';
import { ZetkinAreaAssignment } from '../../areaAssignments/types';
import ZUIMarkdown from 'zui/ZUIMarkdown';
import useOrganization from 'features/organizations/hooks/useOrganization';
import ZUIFutures from 'zui/ZUIFutures';
import oldTheme from 'theme';
import { Msg } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import useAssignmentAreas from 'features/areaAssignments/hooks/useAssignmentAreas';

const Page: FC<{
  assignment: ZetkinAreaAssignment;
}> = ({ assignment }) => {
  const orgFuture = useOrganization(assignment.organization_id);
  const areas = useAssignmentAreas(assignment.organization_id, assignment.id);
  const userMustSelectArea = areas.length > 1;
  const userHasAreas = !!areas.length;

  return (
    <ZUIFutures futures={{ org: orgFuture }}>
      {({ data: { org } }) => (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100dvh',
            width: '100vw',
          }}
        >
          <Box
            alignItems="center"
            bgcolor={oldTheme.palette.background.paper}
            display="flex"
            justifyContent="space-between"
            padding={2}
          >
            <Box>
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
          <Divider />
          <Box
            sx={{
              overflowY: 'auto',
              padding: 2,
              paddingBottom: 8,
            }}
          >
            {assignment.instructions ? (
              <Card sx={{ mt: 2, mx: 1 }}>
                <Typography m={2}>
                  <Msg id={messageIds.instructions.instructionsHeader} />
                </Typography>
                <Divider />
                <Box
                  sx={{
                    mx: 1,
                  }}
                >
                  <ZUIMarkdown markdown={assignment.instructions} />
                </Box>
              </Card>
            ) : (
              <Box
                sx={{
                  alignItems: 'center',
                  bottom: 80,
                  display: 'flex',
                  flexDirection: 'column',
                  left: 0,
                  position: 'absolute',
                  right: 0,
                }}
              >
                <HomeWork
                  sx={{ color: oldTheme.palette.grey[400], fontSize: 100 }}
                />
                <Typography color="secondary" variant="body1">
                  <Msg id={messageIds.instructions.ready} />
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            alignItems="center"
            display="flex"
            justifyContent="center"
            sx={{
              bottom: 16,
              left: 0,
              position: 'absolute',
              right: 0,
            }}
          >
            {userHasAreas && (
              <Button
                fullWidth
                href={
                  userMustSelectArea
                    ? `/canvass/${assignment.id}/areas`
                    : `/canvass/${assignment.id}/areas/${areas?.[0]?.id}`
                }
                sx={{
                  width: '50%',
                }}
                variant="contained"
              >
                {userMustSelectArea ? (
                  <Msg id={messageIds.instructions.selectArea} />
                ) : (
                  <Msg id={messageIds.instructions.start} />
                )}
              </Button>
            )}
          </Box>
        </Box>
      )}
    </ZUIFutures>
  );
};

type CanvassInstructionsPageProps = {
  areaAssId: number;
};

const CanvassInstructionsPage: FC<CanvassInstructionsPageProps> = ({
  areaAssId,
}) => {
  const myAssignments = useMyCanvassAssignments() || [];
  const assignment = myAssignments.find(
    (assignment) => assignment.id == areaAssId
  );

  if (!assignment) {
    return null;
  }

  return <Page assignment={assignment} />;
};

export default CanvassInstructionsPage;
