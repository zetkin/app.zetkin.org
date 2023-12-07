import timezones from 'timezones-list';
import { FormControl, Menu, MenuItem, Select, TextField } from '@mui/material';
import { useState } from 'react';
import { Box } from '@mui/system';
const ZUITimezonePicker = () => {
  const [tzCode, setTzCode] = useState('');
  //   console.log(timezones, ' ??');
  return (
    <Box width="300px">
      {/* <FormControl fullWidth> */}
      {/* <Select
          label=""
          onChange={(ev) => {
            setTzCode(ev.target.value);
          }}
          onClickCapture={(e) => e.stopPropagation()}
          //   onClick={(e) => e.stopPropagation()}
          value={'Pacific/Midway'}
        > */}
      <TextField
        select
        label={'Time zone'}
        value={tzCode}
        onChange={(e) => setTzCode(e.target.value)}
        // SelectProps={{
        //   MenuProps: { disablePortal: true },
        // }}
      >
        {timezones.map((timezone, index) => {
          return (
            <MenuItem
              key={`timezone-${index}`}
              id={`timezone-${index}`}
              value={timezone.tzCode}
            >
              {timezone.name}
            </MenuItem>
          );
        })}
      </TextField>
      {/* </Select> */}
      {/* </FormControl> */}
    </Box>
  );
};

export default ZUITimezonePicker;
