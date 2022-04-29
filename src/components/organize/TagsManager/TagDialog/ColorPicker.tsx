import ReplayIcon from '@material-ui/icons/Replay';
import { useIntl } from 'react-intl';
import { Box, InputAdornment, TextField } from '@material-ui/core';
import { useEffect, useState } from 'react';

import { DEFAULT_TAG_COLOR } from '../utils';

const randomColor = () => {
  return Math.floor(Math.random() * 16777215).toString(16);
};

const ColorPicker: React.FunctionComponent<{
  onChange: (value: string) => void;
  value: string;
}> = ({ value, onChange }) => {
  const intl = useIntl();

  // Strip # from original value when setting internal value
  const [internalValue, setInternalValue] = useState<string | null>(
    value ? value.split('#')[1] : null
  );

  useEffect(() => {
    // Add # back in to value
    if (internalValue) {
      onChange(`#${internalValue}`);
    }
  }, [internalValue]);

  return (
    <TextField
      data-testid="TagManager-TagDialog-colorField"
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Box
              alignItems="center"
              bgcolor={internalValue ? `#${internalValue}` : DEFAULT_TAG_COLOR}
              borderRadius={7}
              display="flex"
              height={30}
              justifyContent="center"
              width={30}
            >
              <ReplayIcon
                fontSize="small"
                onClick={() => setInternalValue(randomColor())}
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
        setInternalValue(e.target.value);
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
