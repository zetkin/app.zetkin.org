import { Button } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

import EventFilterPane from './EventFilterPane';
import messageIds from 'features/calendar/l10n/messageIds';
import { Msg } from 'core/i18n';
import { usePanes } from 'utils/panes';

interface CalendarEventFilterProps {
  orgId: number;
}
const CalendarEventFilter = ({ orgId }: CalendarEventFilterProps) => {
  const { openPane } = usePanes();

  return (
    <Button
      onClick={() =>
        openPane({
          render() {
            return <EventFilterPane orgId={orgId} />;
          },
          width: 400,
        })
      }
      startIcon={<FilterListIcon />}
      sx={{ ml: 2 }}
      variant="outlined"
    >
      <Msg id={messageIds.eventFilter.filter} />
    </Button>
  );
};

export default CalendarEventFilter;
