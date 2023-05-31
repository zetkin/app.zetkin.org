import { ArrowDropDown } from '@mui/icons-material';
import { Box, Button, Menu, MenuItem, Typography } from '@mui/material';
import { FC, useState } from 'react';

import getOffsetStartEnd from './getOffsetStartEnd';
import messageIds from 'features/calendar/l10n/messageIds';
import { Msg } from 'core/i18n';
import useSelectedEvents from 'features/events/hooks/useSelectedEvents';
import ZUIDateSpan from 'zui/ZUIDateSpan';

const MoveCopyButtons: FC = () => {
  const [moveMenuOpen, setMoveMenuOpen] = useState(false);
  const [moveMenuAnchorEl, setMoveMenuAnchorEl] =
    useState<HTMLButtonElement | null>(null);
  const [copyMenuOpen, setCopyMenuOpen] = useState(false);
  const [copyMenuAnchorEl, setCopyMenuAnchorEl] =
    useState<HTMLButtonElement | null>(null);

  const selectedEvents = useSelectedEvents();
  const [dayStart, dayEnd] = getOffsetStartEnd(selectedEvents, 1);
  const [weekStart, weekEnd] = getOffsetStartEnd(selectedEvents, 7);

  return (
    <>
      <Button
        endIcon={<ArrowDropDown />}
        onClick={(ev) => {
          setCopyMenuOpen(false);
          setMoveMenuAnchorEl(ev.currentTarget);
          setMoveMenuOpen(!moveMenuOpen);
        }}
        variant="outlined"
      >
        <Msg id={messageIds.selectionBar.moveCopyButtons.move} />
      </Button>
      <Menu
        anchorEl={moveMenuAnchorEl}
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'top',
        }}
        elevation={3}
        onClose={() => setMoveMenuOpen(false)}
        open={moveMenuOpen}
        sx={{ zIndex: 201 }}
        transformOrigin={{
          horizontal: 'right',
          vertical: 'bottom',
        }}
      >
        <Box sx={{ cursor: 'default', paddingLeft: 2 }}>
          <Typography fontWeight="medium" variant="body2">
            <Msg
              id={messageIds.selectionBar.moveCopyButtons.moveMenuHeader}
              values={{ numberOfEvents: selectedEvents.length }}
            />
          </Typography>
        </Box>
        <MenuItem>
          <Msg
            id={messageIds.selectionBar.moveCopyButtons.nextWeek}
            values={{
              dates: <ZUIDateSpan end={weekEnd} start={weekStart} />,
            }}
          />
        </MenuItem>
        <MenuItem>
          <Msg
            id={messageIds.selectionBar.moveCopyButtons.nextDay}
            values={{
              dates: <ZUIDateSpan end={dayEnd} start={dayStart} />,
            }}
          />
        </MenuItem>
      </Menu>
      <Button
        endIcon={<ArrowDropDown />}
        onClick={(ev) => {
          setMoveMenuOpen(false);
          setCopyMenuAnchorEl(ev.currentTarget);
          setCopyMenuOpen(!copyMenuOpen);
        }}
        variant="outlined"
      >
        <Msg id={messageIds.selectionBar.moveCopyButtons.copy} />
      </Button>
      <Menu
        anchorEl={copyMenuAnchorEl}
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'top',
        }}
        elevation={3}
        onClose={() => setCopyMenuOpen(false)}
        open={copyMenuOpen}
        sx={{ zIndex: 201 }}
        transformOrigin={{
          horizontal: 'right',
          vertical: 'bottom',
        }}
      >
        <Box sx={{ cursor: 'default', paddingLeft: 2 }}>
          <Typography fontWeight="medium" variant="body2">
            <Msg
              id={messageIds.selectionBar.moveCopyButtons.copyMenuHeader}
              values={{ numberOfEvents: selectedEvents.length }}
            />
          </Typography>
        </Box>
        <MenuItem>
          <Msg id={messageIds.selectionBar.moveCopyButtons.duplicate} />
        </MenuItem>
        <MenuItem>
          <Msg
            id={messageIds.selectionBar.moveCopyButtons.nextWeek}
            values={{
              dates: <ZUIDateSpan end={weekEnd} start={weekStart} />,
            }}
          />
        </MenuItem>
        <MenuItem>
          <Msg
            id={messageIds.selectionBar.moveCopyButtons.nextDay}
            values={{
              dates: <ZUIDateSpan end={dayEnd} start={dayStart} />,
            }}
          />
        </MenuItem>
        <MenuItem>
          <Msg id={messageIds.selectionBar.moveCopyButtons.createShift} />
        </MenuItem>
      </Menu>
    </>
  );
};

export default MoveCopyButtons;
