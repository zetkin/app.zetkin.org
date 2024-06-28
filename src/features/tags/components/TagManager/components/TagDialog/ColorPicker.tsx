import ReplayIcon from '@mui/icons-material/Replay';
import { Box, InputAdornment, TextField } from '@mui/material';

import { DEFAULT_TAG_COLOR, hexRegex, randomColor } from '../../utils';
import messageIds from '../../../../l10n/messageIds';
import { useMessages } from 'core/i18n';

const ColorPicker: React.FunctionComponent<{
  onChange: (color: { valid: boolean; value: string }) => void;
  value: string;
}> = ({ value, onChange }) => {
  const messages = useMessages(messageIds);

  const error = !!value && !hexRegex.test(value);

  return (
    <TextField
      error={error}
      fullWidth
      helperText={error && messages.dialog.colorErrorText()}
      inputProps={{ 'data-testid': 'TagManager-TagDialog-colorField' }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Box
              alignItems="center"
              bgcolor={value ? `#${value}` : DEFAULT_TAG_COLOR}
              borderRadius="7px"
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
      label={messages.dialog.colorLabel()}
      margin="normal"
      onChange={(e) => {
        onChange({
          valid: !e.target.value || hexRegex.test(e.target.value),
          value: e.target.value,
        });
      }}
      onClick={(e) => (e.target as HTMLInputElement).focus()}
      placeholder={messages.dialog.colorLabel()}
      value={value || ''}
      variant="outlined"
    />
  );
};

export default ColorPicker;
