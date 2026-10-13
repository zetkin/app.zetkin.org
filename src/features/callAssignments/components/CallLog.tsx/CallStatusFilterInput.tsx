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
import { colors, icons, states, StateString } from './utils';

const CallStatusFilterInput: FC<
  GridFilterInputValueProps & {
    options: CallState[];
  }
> = ({ applyValue, item, options }) => {
  const [value, setValue] = useState('');

  const callStates: { name: StateString; value: CallState }[] = options.map(
    (option) => {
      return {
        name: states[+option as CallState],
        value: option,
      };
    }
  );

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
          const Icon = icons[state.value];

          return (
            <MenuItem
              key={state.name}
              value={state.value === 0 ? '0' : state.value}
            >
              <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                <Box
                  sx={(theme) => {
                    const color = colors[state.value];

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
                  {state.name === 'unfinished' && (
                    <Msg id={messageIds.calls.callState.unfinished} />
                  )}
                  {state.name !== 'unfinished' && (
                    <Msg
                      id={callMessageIds.about.previousCalls.status[state.name]}
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
