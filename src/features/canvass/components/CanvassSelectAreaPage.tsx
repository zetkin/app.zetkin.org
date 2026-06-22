'use client';

import { FC, useState } from 'react';
import React from 'react';
import { ArrowForwardIos } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemButton,
  Typography,
} from '@mui/material';
import { ArrowLeftIcon } from '@mui/x-date-pickers';
import { notFound, useRouter } from 'next/navigation';

import useMyCanvassAssignments from '../hooks/useMyAreaAssignments';
import { ZetkinAreaAssignment } from '../../areaAssignments/types';
import useOrganization from 'features/organizations/hooks/useOrganization';
import ZUIFutures from 'zui/ZUIFutures';
import oldTheme from 'theme';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import useAssignmentAreas from 'features/areaAssignments/hooks/useAssignmentAreas';
import useAreaAssignees from 'features/areaAssignments/hooks/useAreaAssignees';

const Page: FC<{
  assignment: ZetkinAreaAssignment;
  myUserId: number;
}> = ({ assignment, myUserId }) => {
  const orgFuture = useOrganization(assignment.organization_id);
  const router = useRouter();
  const areas = useAssignmentAreas(assignment.organization_id, assignment.id);
  const assigneesFuture = useAreaAssignees(
    assignment.organization_id,
    assignment.id
  );
  const messages = useMessages(messageIds);
  const [loadingAreaId, setLoadingAreaId] = useState<number | null>(null);

  let hasMixedUsers = false;
  if (
    !assigneesFuture.isLoading &&
    assigneesFuture.data &&
    assigneesFuture.data.length != 1
  ) {
    hasMixedUsers = assigneesFuture.data
      ?.slice(1)
      .some((a) => a.user_id != assigneesFuture.data?.[0].user_id);
  }

  return (
    <ZUIFutures futures={{ assignees: assigneesFuture, org: orgFuture }}>
      {({ data: { assignees, org } }) => (
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
            py={2}
          >
            <Box display="flex">
              <ArrowLeftIcon
                fontSize="large"
                onClick={() => router.push(`/canvass/${assignment.id}`)}
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
          </Box>
          <Divider />
          <Box>
            {areas.length > 0 ? (
              <List disablePadding>
                {areas.map((area) => (
                  <React.Fragment key={area.id}>
                    <ListItem key={area.id} disablePadding>
                      <ListItemButton
                        href={`/canvass/${assignment.id}/areas/${area.id}`}
                        onClick={() => {
                          setLoadingAreaId(area.id);
                        }}
                        sx={{
                          alignItems: 'center',
                          display: 'flex',
                          height: 64,
                          justifyContent: 'space-between',
                          px: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            justifyContent: area.description
                              ? 'flex-start'
                              : 'center',
                          }}
                        >
                          <Typography variant="body1">{area.title}</Typography>
                          {area.description && (
                            <Typography color="text.secondary" variant="body2">
                              {area.description}
                            </Typography>
                          )}
                        </Box>
                        {loadingAreaId === area.id ? (
                          <CircularProgress size={20} />
                        ) : (
                          <Box alignItems="center" display={'flex'}>
                            {hasMixedUsers &&
                              assignees.find(
                                (a) =>
                                  a.area_id == area.id && a.user_id == myUserId
                              ) && (
                                <Chip
                                  label={messages.selectArea.assignedToMe()}
                                  sx={{
                                    backgroundColor: '#f2c71b',
                                    marginRight: 2,
                                  }}
                                />
                              )}
                            <ArrowForwardIos fontSize="small" />
                          </Box>
                        )}
                      </ListItemButton>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography>
                <Msg id={messageIds.selectArea.noAreas} />
              </Typography>
            )}
          </Box>
        </Box>
      )}
    </ZUIFutures>
  );
};

type CanvassSelectAreaPageProps = {
  areaAssId: number;
  myUserId: number;
};

const CanvassSelectAreaPage: FC<CanvassSelectAreaPageProps> = ({
  areaAssId,
  myUserId,
}) => {
  const myAssignments = useMyCanvassAssignments() || [];
  const assignment = myAssignments.find(
    (assignment) => assignment.id == areaAssId
  );

  if (!assignment) {
    notFound();
  }

  return <Page assignment={assignment} myUserId={myUserId} />;
};

export default CanvassSelectAreaPage;
