import { TextField } from '@material-ui/core';

const ColorPicker: React.FunctionComponent<{
  defaultValue?: string;
  onChange: (value: string) => void;
}> = ({ defaultValue, onChange }) => {
  return (
    <TextField
      defaultValue={defaultValue}
      fullWidth
      id="TagManager-TagDialog-colorField"
      label="Color"
      margin="normal"
      onChange={(e) => onChange(e.target.value)}
      onClick={(e) => (e.target as HTMLInputElement).focus()}
      variant="outlined"
    />
  );
};

export default ColorPicker;
