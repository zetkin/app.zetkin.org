'use client';

import { FC, useState } from 'react';
import React from 'react';
import { ArrowForwardIos } from '@mui/icons-material';
import {
  Avatar,
  Box,
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
import { Msg } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import useAssignmentAreas from 'features/areaAssignments/hooks/useAssignmentAreas';

const Page: FC<{
  assignment: ZetkinAreaAssignment;
}> = ({ assignment }) => {
  const orgFuture = useOrganization(assignment.organization_id);
  const router = useRouter();
  const areas = useAssignmentAreas(assignment.organization_id, assignment.id);
  const [loadingAreaId, setLoadingAreaId] = useState<number | null>(null);
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
                          <ArrowForwardIos fontSize="small" />
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
};

const CanvassSelectAreaPage: FC<CanvassSelectAreaPageProps> = ({
  areaAssId,
}) => {
  const myAssignments = useMyCanvassAssignments() || [];
  const assignment = myAssignments.find(
    (assignment) => assignment.id == areaAssId
  );

  if (!assignment) {
    notFound();
  }

  return <Page assignment={assignment} />;
};

export default CanvassSelectAreaPage;
