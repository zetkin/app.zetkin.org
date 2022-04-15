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
          <InputAdornment position="start">
            <Button>Pick Color</Button>
          </InputAdornment>
        ),
      }}
      margin="normal"
      placeholder="Color"
      variant="outlined"
    />
  );
};

export default ColorPicker;
