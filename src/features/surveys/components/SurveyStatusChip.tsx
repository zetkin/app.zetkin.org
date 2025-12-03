import { Box, SxProps } from '@mui/material';
import { FC, useMemo } from 'react';

import { Msg } from 'core/i18n';
import { SurveyState } from '../hooks/useSurveyState';
import messageIds from '../l10n/messageIds';
import oldTheme from 'theme';

interface SurveyStatusChipProps {
  state: SurveyState;
}

const SurveyStatusChip: FC<SurveyStatusChipProps> = ({ state }) => {
  const boxStyles: SxProps = useMemo(() => {
    return {
      alignItems: 'center',
      borderRadius: '2em',
      color: 'white',
      display: 'inline-flex',
      fontSize: 14,
      fontWeight: 'bold',
      padding: '0.5em 0.7em',
      ...{
        [SurveyState.UNPUBLISHED]: {
          backgroundColor: oldTheme.palette.error.main,
        },
        [SurveyState.DRAFT]: {
          backgroundColor: oldTheme.palette.grey[500],
        },
        [SurveyState.PUBLISHED]: {
          backgroundColor: oldTheme.palette.success.main,
        },
        [SurveyState.SCHEDULED]: {
          backgroundColor: oldTheme.palette.statusColors.blue,
        },
        [SurveyState.UNKNOWN]: {
          backgroundColor: oldTheme.palette.grey[500],
        },
      }[state],
    };
  }, [state]);

  if (state == SurveyState.UNKNOWN) {
    return null;
  }

  return (
    <Box sx={boxStyles}>
      <Msg id={messageIds.state[state]} />
    </Box>
  );
};

export default SurveyStatusChip;
