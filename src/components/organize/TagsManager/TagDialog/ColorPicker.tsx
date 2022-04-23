import { TextField } from '@material-ui/core';

const ColorPicker: React.FunctionComponent<{
  defaultValue?: string;
  onChange: (value: string) => void;
}> = ({ defaultValue, onChange }) => {
  return (
    <TextField
      data-testid="TagManager-TagDialog-colorField"
      defaultValue={defaultValue}
      fullWidth
      label="Color"
      margin="normal"
      onChange={(e) => onChange(e.target.value)}
      onClick={(e) => (e.target as HTMLInputElement).focus()}
      variant="outlined"
    />
  );
};

export default ColorPicker;
