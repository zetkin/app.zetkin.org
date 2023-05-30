import { ArrowDropDown } from '@mui/icons-material';
import { Box } from '@mui/system';
import { CheckBoxOutlined } from '@mui/icons-material';
import { Button, Divider, Paper, Typography } from '@mui/material';
import { useSelector, useStore } from 'react-redux';

import messageIds from '../../calendar/l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';
import { resetSelection } from 'features/events/store';
import { RootState } from 'core/store';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';
import { useContext } from 'react';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';

const SelectionBar = () => {
  const store = useStore<RootState>();
  const messages = useMessages(messageIds);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);

  const selectedEvents = useSelector(
    (state: RootState) => state.events.selectedEvents
  );

  const events = useSelector(
    (state: RootState) => state.events.eventList.items
  );

  const unpublishedEvents = events.filter((event) =>
    selectedEvents.some(
      (selectedEvent) =>
        selectedEvent == event.id && event.data?.published === null
    )
  );

  const publishedEvents = events.filter((event) =>
    selectedEvents.some(
      (selectedEvent) => selectedEvent == event.id && event.data?.published
    )
  );

  const handleDeselect = () => {
    store.dispatch(resetSelection());
  };

  const ellipsisMenuItems = [
    {
      label: messages.selectionBar.ellipsisMenu.delete(),
      onSelect: () => {
        showConfirmDialog({
          onSubmit: () => {
            console.log('delete');
          },
          title: messages.selectionBar.ellipsisMenu.confirmDelete(),
          warningText: messages.selectionBar.ellipsisMenu.deleteWarning(),
        });
      },
      textColor: '#ed1c55',
    },
    {
      divider: true,
      label: messages.selectionBar.ellipsisMenu.cancel(),
      onSelect: () => {},
      textColor: '#ed1c55',
    },
    {
      label:
        publishedEvents.length > 0
          ? messages.selectionBar.ellipsisMenu.unpublish()
          : '',
      onSelect: () => {},
      textColor: '#f66000',
    },
    {
      label:
        unpublishedEvents.length > 0
          ? messages.selectionBar.ellipsisMenu.publish()
          : '',
      onSelect: () => {},
    },
    { label: messages.selectionBar.ellipsisMenu.print(), onSelect: () => {} },
  ];

  return (
    <Box
      sx={{
        position: 'relative',
        zIndex: 200,
      }}
    >
      {selectedEvents.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Paper
            elevation={3}
            sx={{
              backgroundColor: 'white',
              borderRadius: '5px',
              bottom: 15,
              padding: 2,
              position: 'fixed',
              width: 'calc(100% - 97px)',
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
                <ZUIEllipsisMenu items={ellipsisMenuItems} />
              </Box>
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default SelectionBar;
