import { Typography } from '@mui/material';
import { Box, useTheme } from '@mui/system';

import { Msg } from 'core/i18n';

import messageIds from 'features/import/l10n/messageIds';

export enum COUNT_STATUS {
  CREATED = 'created',
  UPDATED = 'updated',
}

interface PeopleCounterProps {
  changedNum: number;
  status: COUNT_STATUS;
}

const PeopleCounter: React.FunctionComponent<PeopleCounterProps> = ({
  changedNum,
  status,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        border: 'solid 1px lightgrey',
        borderRadius: '4px',
        p: 2,
        width: '100%',
      }}
    >
      <Typography
        sx={{
          color:
            status === COUNT_STATUS.CREATED
              ? theme.palette.success.main
              : theme.palette.info.light,
        }}
        variant="h2"
      >
        {changedNum}
      </Typography>
      <Msg
        id={
          status === COUNT_STATUS.CREATED
            ? messageIds.validation.trackers.created
            : messageIds.validation.trackers.updated
        }
      />
    </Box>
  );
};
export default PeopleCounter;
