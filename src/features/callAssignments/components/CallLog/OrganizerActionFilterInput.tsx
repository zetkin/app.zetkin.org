import {
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

const OrganizerActionFilterInput: FC<
  GridFilterInputValueProps & {
    options: ['actionNeeded', 'actionTaken', 'none'];
  }
> = ({ applyValue, item, options }) => {
  const [value, setValue] = useState('');

  return (
    <FormControl>
      <InputLabel variant="standard">
        <Msg id={messageIds.calls.filters.flagged.title} />
      </InputLabel>
      <Select
        onChange={(evt) => {
          setValue(evt.target.value);
          applyValue({ ...item, value: evt.target.value });
        }}
        value={value}
        variant="standard"
      >
        {options.map((option) => {
          return (
            <MenuItem key={option} value={option}>
              <Typography>
                <Msg id={messageIds.calls.filters.flagged[option]} />
              </Typography>
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default OrganizerActionFilterInput;
