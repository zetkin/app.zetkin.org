import ReplayIcon from '@material-ui/icons/Replay';
import { useIntl } from 'react-intl';
import { Box, InputAdornment, TextField } from '@material-ui/core';

import { DEFAULT_TAG_COLOR } from '../utils';

const randomColor = () => {
  return Math.floor(Math.random() * 16777215).toString(16);
};

const hexRegex = new RegExp(/(^[0-9a-f]{6}$)|(^[0-9a-f]{3}$)/i);

const ColorPicker: React.FunctionComponent<{
  onChange: (color: { valid: boolean; value: string }) => void;
  value: string;
}> = ({ value, onChange }) => {
  const intl = useIntl();

  const error = !!value && !hexRegex.test(value);

  return (
    <TextField
      data-testid="TagManager-TagDialog-colorField"
      error={error}
      fullWidth
      helperText={
        error &&
        intl.formatMessage({
          id: 'misc.tags.tagsManager.tagDialog.colorErrorText',
        })
      }
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Box
              alignItems="center"
              bgcolor={value ? `#${value}` : DEFAULT_TAG_COLOR}
              borderRadius={7}
              display="flex"
              height={30}
              justifyContent="center"
              width={30}
            >
              <ReplayIcon
                fontSize="small"
                onClick={() => {
                  const newColor = randomColor();
                  onChange({ valid: hexRegex.test(newColor), value: newColor });
                }}
                style={{
                  cursor: 'pointer',
                  opacity: 0.7,
                }}
              />
            </Box>
          </InputAdornment>
        ),
      }}
      label={intl.formatMessage({
        id: 'misc.tags.tagsManager.tagDialog.colorLabel',
      })}
      margin="normal"
      onChange={(e) => {
        onChange({
          valid: !e.target.value || hexRegex.test(e.target.value),
          value: e.target.value,
        });
      }}
      onClick={(e) => (e.target as HTMLInputElement).focus()}
      placeholder={intl.formatMessage({
        id: 'misc.tags.tagsManager.tagDialog.colorLabel',
      })}
      value={value || ''}
      variant="outlined"
    />
  );
};

export default ColorPicker;
