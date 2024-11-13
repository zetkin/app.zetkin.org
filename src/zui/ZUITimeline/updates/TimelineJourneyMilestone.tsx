import React from 'react';
import { AlarmOff, Cancel, CheckCircle, Flag } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

import { Msg } from 'core/i18n';
import theme from 'theme';
import UpdateContainer from './elements/UpdateContainer';
import { ZetkinUpdateJourneyInstanceMilestone } from 'zui/ZUITimeline/types';
import ZUIPersonLink from 'zui/ZUIPersonLink';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import messageIds from '../l10n/messageIds';

interface Props {
  update: ZetkinUpdateJourneyInstanceMilestone;
}

const TimelineJourneyMilestone: React.FunctionComponent<Props> = ({
  update,
}) => {
  let changeToRender: 'complete' | 'incomplete' | 'deadline';

  const changeProp = Object.keys(update.details.changes)[0];

  if (changeProp === 'completed') {
    changeToRender = !update.details.changes[changeProp]?.to
      ? 'incomplete'
      : 'complete';
  } else if (changeProp === 'deadline') {
    changeToRender = 'deadline';
  }

  return (
    <UpdateContainer headerContent={renderDescriptionText()} update={update}>
      {renderContent()}
    </UpdateContainer>
  );

  function renderDescriptionText() {
    return (
      <Msg
        id={messageIds.updates.journeyinstance.updatemilestone[changeToRender]}
        values={{
          actor: <ZUIPersonLink person={update.actor} />,
        }}
      />
    );
  }

  function renderContent() {
    return (
      <Box display="flex">
        {changeToRender === 'complete' && (
          <CheckCircle sx={{ color: theme.palette.success.main }} />
        )}
        {changeToRender === 'incomplete' && (
          <Cancel sx={{ color: theme.palette.warning.main }} />
        )}
        <Box paddingX={1}>
          <Typography variant="h6">{update.details.milestone.title}</Typography>
        </Box>
        {changeToRender === 'deadline' && renderDeadlineUpdate()}
      </Box>
    );
  }

  function renderDeadlineUpdate() {
    const deadlineTo = update.details.changes?.deadline?.to;

    return (
      <Box alignItems="center" display="flex" style={{ gap: 8 }}>
        {deadlineTo ? (
          <Flag sx={{ color: theme.palette.text.secondary }} />
        ) : (
          <AlarmOff sx={{ color: theme.palette.text.secondary }} />
        )}
        <Typography color="textSecondary" variant="body2">
          {deadlineTo ? (
            <Msg
              id={
                messageIds.updates.journeyinstance.updatemilestone
                  .deadlineUpdate
              }
              values={{
                datetime: (
                  <ZUIRelativeTime datetime={deadlineTo} midnightPatch />
                ),
              }}
            />
          ) : (
            <Msg
              id={
                messageIds.updates.journeyinstance.updatemilestone
                  .deadlineRemove
              }
            />
          )}
        </Typography>
      </Box>
    );
  }
};

export default TimelineJourneyMilestone;
