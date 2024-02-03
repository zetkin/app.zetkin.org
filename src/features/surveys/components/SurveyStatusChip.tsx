import { Box } from '@mui/material';
import { FC } from 'react';
import { makeStyles } from '@mui/styles';
import { Msg } from 'core/i18n';
import { SurveyState } from '../hooks/useSurveyState';

import messageIds from '../l10n/messageIds';

interface SurveyStatusChipProps {
  state: SurveyState;
}

const useStyles = makeStyles((theme) => ({
  chip: {
    alignItems: 'center',
    borderRadius: '2em',
    color: 'white',
    display: 'inline-flex',
    fontSize: 14,
    fontWeight: 'bold',
    padding: '0.5em 0.7em',
  },
  draft: {
    backgroundColor: theme.palette.grey[500],
  },
  published: {
    backgroundColor: theme.palette.success.main,
  },
  scheduled: {
    backgroundColor: theme.palette.statusColors.blue,
  },
  spinner: {
    marginLeft: '0.5em',
  },
  unpublished: {
    backgroundColor: theme.palette.error.main,
  },
}));

const SurveyStatusChip: FC<SurveyStatusChipProps> = ({ state }) => {
  const classes = useStyles();

  if (state == SurveyState.UNKNOWN) {
    return null;
  }

  const classMap: Record<SurveyState, string> = {
    [SurveyState.UNPUBLISHED]: classes.unpublished,
    [SurveyState.DRAFT]: classes.draft,
    [SurveyState.PUBLISHED]: classes.published,
    [SurveyState.SCHEDULED]: classes.scheduled,
    [SurveyState.UNKNOWN]: classes.draft,
  };

  const colorClassName = classMap[state];

  return (
    <Box className={`${colorClassName} ${classes.chip}`}>
      <Msg id={messageIds.state[state]} />
    </Box>
  );
};

export default SurveyStatusChip;
