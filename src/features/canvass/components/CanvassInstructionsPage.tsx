'use client';

import React, { FC, useState } from 'react';
import { ArrowForwardIos } from '@mui/icons-material';
import {
  Box,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemButton,
  Typography,
} from '@mui/material';

import useMyCanvassAssignments from 'features/canvass/hooks/useMyAreaAssignments';
import { ZetkinAreaAssignment } from 'features/areaAssignments/types';
import ZUIMarkdown from 'zui/ZUIMarkdown';
import oldTheme from 'theme';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/canvass/l10n/messageIds';
import useAssignmentAreas from 'features/areaAssignments/hooks/useAssignmentAreas';
import ZUIText from 'zui/components/ZUIText';

const Page: FC<{
  assignment: ZetkinAreaAssignment;
}> = ({ assignment }) => {
  const areas = useAssignmentAreas(assignment.organization_id, assignment.id);
  const messages = useMessages(messageIds);
  const [loadingAreaId, setLoadingAreaId] = useState<number | null>(null);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          overflowY: 'auto',
          paddingBottom: 8,
        }}
      >
        <Box
          bgcolor="white"
          borderRadius={2}
          padding={2}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            mt: 2,
          }}
        >
          <Typography
            color={oldTheme.palette.text.secondary}
            variant="subtitle1"
          >
            {messages.instructions.instructionsHeader().toUpperCase()}
          </Typography>
          <Box>
            {assignment.instructions ? (
              <ZUIMarkdown markdown={assignment.instructions} />
            ) : (
              <ZUIText>
                <Msg id={messageIds.instructions.ready} />
              </ZUIText>
            )}
          </Box>
        </Box>
        {areas && (
          <Box
            bgcolor="white"
            borderRadius={2}
            padding={2}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              mt: 2,
            }}
          >
            <Typography
              color={oldTheme.palette.text.secondary}
              variant="subtitle1"
            >
              {messages.instructions.selectArea().toUpperCase()}
            </Typography>

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
                            <Typography variant="body1">
                              {area.title}
                            </Typography>
                            {area.description && (
                              <Typography
                                color="text.secondary"
                                variant="body2"
                              >
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
      </Box>
    </Box>
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
