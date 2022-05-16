import AlarmOffIcon from '@material-ui/icons/AlarmOff';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import FlagIcon from '@material-ui/icons/Flag';
import { FormattedMessage } from 'react-intl';
import React from 'react';
import { Grid, Typography } from '@material-ui/core';

import theme from 'theme';
import UpdateContainer from './elements/UpdateContainer';
import ZetkinPersonLink from 'components/ZetkinPersonLink';
import ZetkinRelativeTime from 'components/ZetkinRelativeTime';
import { ZetkinUpdateJourneyMilestone } from 'types/updates';

interface Props {
  update: ZetkinUpdateJourneyMilestone;
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
          actor: <ZetkinPersonLink person={update.actor} />,
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
      <>
        {deadlineTo ? (
          <FlagIcon style={iconStyle} />
        ) : (
          <AlarmOffIcon style={iconStyle} />
        )}
        <Typography color="textSecondary" component={Grid} item variant="body2">
          <FormattedMessage
            id={`misc.updates.${update.type}.${
              deadlineTo ? 'deadlineUpdate' : 'deadlineRemove'
            }`}
            values={
              deadlineTo
                ? {
                    datetime: <ZetkinRelativeTime datetime={deadlineTo} />,
                  }
                : {}
            }
          />
        </Typography>
      </>
    );
  }
};

export default TimelineJourneyMilestone;
