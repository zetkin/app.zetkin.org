import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { GridFilterInputValueProps } from '@mui/x-data-grid-pro';
import { FC, useState } from 'react';

import { Msg } from 'core/i18n';
import messageIds from 'features/callAssignments/l10n/messageIds';
import callMessageIds from 'features/call/l10n/messageIds';
import { CallState } from 'features/call/types';
import { colors, icons, states } from './utils';

const CallStatusFilterInput: FC<
  GridFilterInputValueProps & {
    callStates: CallState[];
  }
> = ({ applyValue, item, callStates }) => {
  const [value, setValue] = useState('');

  return (
    <FormControl>
      <InputLabel variant="standard">
        <Msg id={messageIds.calls.filters.status} />
      </InputLabel>
      <Select
        onChange={(evt) => {
          setValue(evt.target.value);
          applyValue({ ...item, value: evt.target.value });
        }}
        value={value}
        variant="standard"
      >
        {callStates.map((state) => {
          const Icon = icons[state];
          const stateString = states[state];

          return (
            <MenuItem
              key={stateString}
              value={state === 0 ? '0' : state.toString()}
            >
              <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                <Box
                  sx={(theme) => {
                    const color = colors[state];

                    return {
                      alignItems: 'center',
                      color:
                        color === 'warning'
                          ? theme.palette.warning.dark
                          : theme.palette[color].main,
                      display: 'flex',
                      gap: 1,
                      justifyContent: 'center',
                    };
                  }}
                >
                  <Icon />
                </Box>
                <Typography>
                  {stateString === 'unfinished' && (
                    <Msg id={messageIds.calls.callState.unfinished} />
                  )}
                  {stateString !== 'unfinished' && (
                    <Msg
                      id={
                        callMessageIds.about.previousCalls.status[stateString]
                      }
                    />
                  )}
                </Typography>
              </Box>
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default CallStatusFilterInput;
