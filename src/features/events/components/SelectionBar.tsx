import { ArrowDropDown } from '@mui/icons-material';
import { Box } from '@mui/system';
import { CheckBoxOutlined } from '@mui/icons-material';
import { Button, Divider, Paper, Typography } from '@mui/material';
import { useSelector, useStore } from 'react-redux';

import { eventsDeselected } from 'features/events/store';
import messageIds from '../../calendar/l10n/messageIds';
import { Msg } from 'core/i18n';
import { RootState } from 'core/store';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';

const SelectionBar = () => {
  const store = useStore<RootState>();
  const selectedEvents = useSelector(
    (state: RootState) => state.events.selectedEvents
  );

  const handleDeselect = () => {
    store.dispatch(eventsDeselected([]));
  };

  return (
    <Box sx={{ position: 'fixed', zIndex: 200 }}>
      {selectedEvents.length > 0 && (
        <Paper
          elevation={3}
          sx={{
            backgroundColor: 'white',
            borderRadius: '5px',
            bottom: 15,
            padding: 2,
            position: 'fixed',
            width: 'calc(100% - 65px)',
          }}
        >
          <Box display="flex" justifyContent="space-between">
            <Box alignItems="center" display="flex">
              <CheckBoxOutlined color="primary" />
              <Typography color="primary" sx={{ px: 0.4 }}>
                {selectedEvents.length}
              </Typography>
              <Button color="primary" onClick={handleDeselect} sx={{ mr: 1 }}>
                <Msg id={messageIds.selectionBar.deselect} />
              </Button>
              <Divider orientation="vertical" variant="fullWidth" />
              <Button
                color="primary"
                sx={{ borderRadius: '5px', ml: 1.5 }}
                variant="outlined"
              >
                <Msg id={messageIds.selectionBar.editEvents} />
              </Button>
            </Box>
            <Box
              alignItems="center"
              display="flex"
              gap={1}
              justifyContent="center"
            >
              <Button endIcon={<ArrowDropDown />} variant="outlined">
                <Msg id={messageIds.selectionBar.move} />
              </Button>
              <Button endIcon={<ArrowDropDown />} variant="outlined">
                <Msg id={messageIds.selectionBar.copy} />
              </Button>
              <ZUIEllipsisMenu items={[]} />
            </Box>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default SelectionBar;
