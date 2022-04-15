import { useRef } from 'react';
import { Box, Button, InputAdornment, TextField } from '@material-ui/core';

const ColorPicker: React.FunctionComponent<{
  onChange: (value: string) => void;
  value: string;
}> = ({ value, onChange }) => {
  return (
    <TextField
      fullWidth
      inputProps={{
        startAdornment: (
          <InputAdornment position="start">Pick Color</InputAdornment>
        ),
      }}
      margin="normal"
      onClick={(e) => (e.target as HTMLInputElement).focus()}
      placeholder="Color"
      variant="outlined"
    />
  );
};

export default ColorPicker;
