'use client';

import { FC, useState } from 'react';
import React from 'react';
import { Pentagon } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';

import useMyCanvassAssignments from '../hooks/useMyAreaAssignments';
import { ZetkinAreaAssignment } from '../../areaAssignments/types';
import useOrganization from 'features/organizations/hooks/useOrganization';
import ZUIFutures from 'zui/ZUIFutures';
import oldTheme from 'theme';
import { Msg } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import useAssignmentAreas from 'features/areaAssignments/hooks/useAssignmentAreas';
import { Zetkin2Area } from 'features/areas/types';

const Page: FC<{
  assignment: ZetkinAreaAssignment;
}> = ({ assignment }) => {
  const orgFuture = useOrganization(assignment.organization_id);
  const router = useRouter();
  const areas = useAssignmentAreas(assignment.organization_id, assignment.id);
  const [selectedArea, setSelectedArea] = useState<Zetkin2Area | null>(null);
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
            {areas.length > 0 ? (
              <List>
                <Typography>{'Select one area:'}</Typography>
                {areas.map((area) => (
                  <React.Fragment key={area.id}>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => setSelectedArea(area)}
                        selected={selectedArea == area}
                      >
                        <ListItemAvatar>
                          <Avatar>
                            <Pentagon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={area.title}
                          secondary={area.description ?? ''}
                        />
                      </ListItemButton>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography>{'No areas available'}</Typography>
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
            <Button
              fullWidth
              onClick={() =>
                router.push(
                  `/canvass/${assignment.id}/area/${selectedArea?.id}`
                )
              }
              sx={{
                width: '50%',
              }}
              variant="contained"
            >
              <Msg id={messageIds.instructions.start} />
            </Button>
          </Box>
        </Box>
      )}
    </ZUIFutures>
  );
};

type CanvassSelectAreaPageProps = {
  areaAssId: number;
};

const CanvassSelectAreaPage: FC<CanvassSelectAreaPageProps> = ({
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

export default CanvassSelectAreaPage;
