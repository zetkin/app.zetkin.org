import { Box } from '@mui/material';
import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { makeStyles } from '@mui/styles';

import { SurveyState } from '../models/SurveyDataModel';

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
    backgroundColor: theme.palette.targetingStatusBar.blue,
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
      <FormattedMessage id={`pages.surveys.state.${state}`} />
    </Box>
  );
};

export default SurveyStatusChip;
