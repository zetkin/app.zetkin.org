import { Box, Button } from '@mui/material';

import messageIds from 'features/calendar/l10n/messageIds';
import { Msg } from 'core/i18n';

interface AllAndNoneToggleProps {
  onSelectAll: () => void;
  onSelectNone: () => void;
  maxLength: number;
  selectedFilterLength: number;
}
const AllAndNoneToggle = ({
  onSelectAll,
  onSelectNone,
  maxLength,
  selectedFilterLength,
}: AllAndNoneToggleProps) => {
  const disabledNone = selectedFilterLength === 0 ? true : false;
  const disabledAll = selectedFilterLength === maxLength ? true : false;

  return (
    <Box display="flex">
      <Button disabled={disabledAll} onClick={onSelectAll} variant="text">
        <Msg id={messageIds.eventFilter.toggle.all} />
      </Button>
      <Button disabled={disabledNone} onClick={onSelectNone} variant="text">
        <Msg id={messageIds.eventFilter.toggle.none} />
      </Button>
    </Box>
  );
};

export default AllAndNoneToggle;
