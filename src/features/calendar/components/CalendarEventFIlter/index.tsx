import { Button } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import messageIds from 'features/calendar/l10n/messageIds';
import { usePanes } from 'utils/panes';
import EventFilterPane from './EventFilterPane';
import { Msg } from 'core/i18n';
interface CalendarEventFIlterProps {
  orgId: number;
}
const CalendarEventFilter = ({ orgId }: CalendarEventFIlterProps) => {
  const { openPane } = usePanes();

  return (
    <Button
      startIcon={<FilterListIcon />}
      variant="outlined"
      sx={{ ml: 2 }}
      onClick={() =>
        openPane({
          render() {
            return <EventFilterPane orgId={orgId} />;
          },
          width: 400,
        })
      }
    >
      <Msg id={messageIds.eventFilter.filter} />
    </Button>
  );
};

export default CalendarEventFilter;
