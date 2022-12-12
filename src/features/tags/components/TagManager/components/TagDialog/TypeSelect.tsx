import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';

import { ZetkinTag } from 'utils/types/zetkin';

const TypeSelect: React.FC<{
  disabled?: boolean;
  onChange: (value: ZetkinTag['value_type']) => void;
  value: ZetkinTag['value_type'];
}> = ({ disabled, onChange, value }) => {
  const intl = useIntl();

  return (
    <Box mb={0.8} mt={1.5}>
      <FormControl
        data-testid="TypeSelect-formControl"
        disabled={disabled}
        variant="standard"
      >
        <FormLabel>
          <FormattedMessage id={'misc.tags.tagManager.tagDialog.typeLabel'} />
        </FormLabel>
        <RadioGroup
          onChange={(ev) =>
            onChange(
              ev.target.value == 'none'
                ? null
                : (ev.target.value as ZetkinTag['value_type'])
            )
          }
          value={value || 'none'}
        >
          <FormControlLabel
            control={<Radio />}
            label={intl.formatMessage({
              id: 'misc.tags.tagManager.tagDialog.types.none',
            })}
            value="none"
          />
          <FormControlLabel
            control={<Radio />}
            label={intl.formatMessage({
              id: 'misc.tags.tagManager.tagDialog.types.text',
            })}
            value="text"
          />
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default TypeSelect;
