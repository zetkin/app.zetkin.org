import { InputAdornment, TextField } from '@material-ui/core';

const ColorPicker: React.FunctionComponent<{
  defaultValue?: string;
  onChange: (value: string) => void;
}> = ({ defaultValue, onChange }) => {
  return (
    <TextField
      defaultValue={defaultValue}
      fullWidth
      inputProps={{
        startAdornment: (
          <InputAdornment position="start">Pick Color</InputAdornment>
        ),
      }}
      margin="normal"
      onChange={(e) => onChange(e.target.value)}
      onClick={(e) => (e.target as HTMLInputElement).focus()}
      placeholder="Color"
      variant="outlined"
    />
  );
};

export default ColorPicker;
