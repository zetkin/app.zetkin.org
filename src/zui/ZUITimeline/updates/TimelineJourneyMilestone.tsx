import AlarmOffIcon from '@mui/icons-material/AlarmOff';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FlagIcon from '@mui/icons-material/Flag';
import { FormattedMessage } from 'react-intl';
import React from 'react';
import { Box, Grid, Typography } from '@mui/material';

import theme from 'theme';
import UpdateContainer from './elements/UpdateContainer';
import { ZetkinUpdateJourneyInstanceMilestone } from 'zui/ZUITimeline/types';
import ZUIPersonLink from 'zui/ZUIPersonLink';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';

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
      <FormattedMessage
        id={`misc.updates.${update.type}.${changeToRender}`}
        values={{
          actor: <ZUIPersonLink person={update.actor} />,
        }}
      />
    );
  }

  function renderContent() {
    return (
      <Grid alignItems="center" container direction="row" item spacing={2}>
        {changeToRender === 'complete' && (
          <CheckCircleIcon style={{ color: theme.palette.success.main }} />
        )}
        {changeToRender === 'incomplete' && (
          <CancelIcon style={{ color: theme.palette.warning.main }} />
        )}
        <Typography component={Grid} item variant="h6">
          {update.details.milestone.title}
        </Typography>
        {changeToRender === 'deadline' && renderDeadlineUpdate()}
      </Grid>
    );
  }

  function renderDeadlineUpdate() {
    const deadlineTo = update.details.changes?.deadline?.to;
    const iconStyle = {
      color: theme.palette.text.secondary,
      marginLeft: theme.spacing(2),
    };

    return (
      <Box display="flex" flexDirection="row" style={{ gap: 8 }}>
        {deadlineTo ? (
          <FlagIcon style={iconStyle} />
        ) : (
          <AlarmOffIcon style={iconStyle} />
        )}
        <Typography color="textSecondary" variant="body2">
          <FormattedMessage
            id={`misc.updates.${update.type}.${
              deadlineTo ? 'deadlineUpdate' : 'deadlineRemove'
            }`}
            values={
              deadlineTo
                ? {
                    datetime: <ZUIRelativeTime datetime={deadlineTo} />,
                  }
                : {}
            }
          />
        </Typography>
      </Box>
    );
  }
};

export default TimelineJourneyMilestone;
