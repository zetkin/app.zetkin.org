import { Box } from '@mui/system';
import messageIds from 'features/import/l10n/messageIds';
import { Msg } from 'core/i18n';
import { Typography } from '@mui/material';

export enum COUNT_STATUS {
  CREATED = 'created',
  UPDATED = 'updated',
}

interface PeopleCounterProps {
  changedNum: number;
  status: COUNT_STATUS;
}

enum CounterColors {
  created = '#4CAF50',
  updated = '#03A9F4',
}
const PeopleCounter: React.FunctionComponent<PeopleCounterProps> = ({
  changedNum,
  status,
}) => {
  return (
    <Box
      sx={{
        border: 'solid 1px lightgrey',
        borderRadius: '4px',
        p: 2,
        width: '100%',
      }}
    >
      <Typography color={CounterColors[status]} variant="h2">
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
