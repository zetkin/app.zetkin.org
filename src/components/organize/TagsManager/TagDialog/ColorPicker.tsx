import ReplayIcon from '@material-ui/icons/Replay';
import { useIntl } from 'react-intl';
import { Box, InputAdornment, TextField } from '@material-ui/core';
import { useEffect, useState } from 'react';

import { DEFAULT_TAG_COLOR } from '../utils';

const randomColor = () => {
  return Math.floor(Math.random() * 16777215).toString(16);
};

const ColorPicker: React.FunctionComponent<{
  defaultValue?: string;
  onChange: (value: string) => void;
}> = ({ defaultValue, onChange }) => {
  const intl = useIntl();

  // Strip # from original value
  const [value, setValue] = useState<string | null>(
    defaultValue ? defaultValue.slice(1) : null
  );

  useEffect(() => {
    // Add # back in to value
    onChange(`#${value}`);
  }, [value]);

  return (
    <TextField
      data-testid="TagManager-TagDialog-colorField"
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Box
              alignItems="center"
              bgcolor={value ? `#${value}` : DEFAULT_TAG_COLOR}
              borderRadius={3}
              display="flex"
              height={30}
              justifyContent="center"
              width={30}
            >
              <ReplayIcon
                fontSize="small"
                onClick={() => setValue(randomColor())}
                style={{
                  cursor: 'pointer',
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
        setValue(e.target.value);
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
