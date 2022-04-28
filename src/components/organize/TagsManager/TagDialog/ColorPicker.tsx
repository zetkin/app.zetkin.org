import { TextField } from '@material-ui/core';
import { useIntl } from 'react-intl';

const ColorPicker: React.FunctionComponent<{
  defaultValue?: string;
  onChange: (value: string) => void;
}> = ({ defaultValue, onChange }) => {
  const intl = useIntl();
  return (
    <TextField
      data-testid="TagManager-TagDialog-colorField"
      defaultValue={defaultValue}
      fullWidth
      label={intl.formatMessage({
        id: 'misc.tags.tagsManager.tagDialog.colorLabel',
      })}
      margin="normal"
      onChange={(e) => onChange(e.target.value)}
      onClick={(e) => (e.target as HTMLInputElement).focus()}
      variant="outlined"
    />
  );
};

export default ColorPicker;
