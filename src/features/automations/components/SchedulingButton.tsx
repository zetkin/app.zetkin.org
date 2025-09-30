import { ArrowDropDown } from '@mui/icons-material';
import { FC, useState } from 'react';
import {
  Box,
  Button,
  ClickAwayListener,
  Paper,
  Popper,
  TextField,
  Typography,
} from '@mui/material';

import { Msg, useMessages } from 'core/i18n';
import { ZetkinBulkAutomation } from '../types/api';
import useAutomationMutations from '../hooks/useAutomationMutations';
import messageIds from '../l10n/messageIds';
import useAutomationInterval, {
  UseAutomationIntervalUnit,
} from '../hooks/useAutomationInterval';

type Props = {
  automation: ZetkinBulkAutomation;
};

const SchedulingButton: FC<Props> = ({ automation }) => {
  const messages = useMessages(messageIds);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { updateAutomation } = useAutomationMutations(
    automation.organization_id,
    automation.id
  );

  const { value, seconds, setUnit, setValue, unit, unitOptions } =
    useAutomationInterval(automation.schedule.interval);

  return (
    <>
      {automation.active && (
        <Button
          onClick={() => updateAutomation({ active: false })}
          variant="outlined"
        >
          <Msg id={messageIds.itemPage.pauseButton} />
        </Button>
      )}
      {!automation.active && (
        <>
          <Button
            endIcon={<ArrowDropDown />}
            onClick={(ev) => setAnchorEl(ev.currentTarget)}
            variant="contained"
          >
            <Msg id={messageIds.itemPage.schedulingButton} />
          </Button>
          <Popper anchorEl={anchorEl} open={!!anchorEl} placement="bottom-end">
            <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
              <Paper
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  p: 2,
                  width: '24rem',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <TextField
                    fullWidth
                    label={messages.itemPage.scheduling.interval.valueLabel()}
                    onChange={(ev) => setValue(parseInt(ev.target.value))}
                    type="number"
                    value={value}
                  />
                  <TextField
                    fullWidth
                    label={messages.itemPage.scheduling.interval.unitLabel()}
                    onChange={(ev) =>
                      setUnit(ev.target.value as UseAutomationIntervalUnit)
                    }
                    select
                    slotProps={{
                      select: {
                        native: true,
                      },
                    }}
                    value={unit}
                  >
                    {unitOptions.map((unit) => (
                      <option key={unit} value={unit}>
                        {messages.itemPage.scheduling.interval.units[unit]()}
                      </option>
                    ))}
                  </TextField>
                </Box>
                <Typography color="secondary" variant="body2">
                  <Msg
                    id={messageIds.itemPage.scheduling.interval.description}
                  />
                </Typography>
                <Button
                  onClick={() => {
                    setAnchorEl(null);
                    updateAutomation({
                      active: true,
                      schedule: {
                        interval: seconds,
                      },
                    });
                  }}
                  variant="contained"
                >
                  <Msg id={messageIds.itemPage.scheduling.activateButton} />
                </Button>
              </Paper>
            </ClickAwayListener>
          </Popper>
        </>
      )}
    </>
  );
};

export default SchedulingButton;
