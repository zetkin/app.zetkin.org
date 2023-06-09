import { CheckBoxOutlined } from '@mui/icons-material';
import { Box, Button, Divider, Paper, Typography } from '@mui/material';
import { useSelector, useStore } from 'react-redux';

import messageIds from '../../../calendar/l10n/messageIds';
import MoveCopyButtons from './MoveCopyButtons';
import { Msg } from 'core/i18n';
import { resetSelection } from 'features/events/store';
import { RootState } from 'core/store';
import SelectionBarEllipsis from '../SelectionBarEllipsis';

const SelectionBar = () => {
  const store = useStore<RootState>();
  const selectedEventIds = useSelector(
    (state: RootState) => state.events.selectedEventIds
  );

  const handleDeselect = () => {
    store.dispatch(resetSelection());
  };

  return (
    <Box
      sx={{
        position: 'relative',
        zIndex: 200,
      }}
    >
      {selectedEventIds.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Paper
            elevation={3}
            sx={{
              backgroundColor: 'white',
              borderRadius: '5px',
              bottom: 15,
              padding: 2,
              width: '100%',
            }}
          >
            <Box display="flex" justifyContent="space-between">
              <Box alignItems="center" display="flex">
                <CheckBoxOutlined color="primary" />
                <Typography color="primary" sx={{ px: 0.4 }}>
                  {selectedEventIds.length}
                </Typography>
                <Button color="primary" onClick={handleDeselect} sx={{ mr: 1 }}>
                  <Msg id={messageIds.selectionBar.deselect} />
                </Button>
                <Divider orientation="vertical" variant="fullWidth" />
                {/* TODO: Implement edit events                
                <Button
                  color="primary"
                  sx={{ borderRadius: '5px', ml: 1.5 }}
                  variant="outlined"
                >
                  <Msg id={messageIds.selectionBar.editEvents} />
                </Button> */}
              </Box>
              <Box
                alignItems="center"
                display="flex"
                gap={1}
                justifyContent="center"
              >
                <MoveCopyButtons />
                <SelectionBarEllipsis />
              </Box>
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default SelectionBar;
