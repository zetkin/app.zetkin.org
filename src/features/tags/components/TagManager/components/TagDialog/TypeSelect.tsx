import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';

import { ZetkinTag } from 'utils/types/zetkin';

import messageIds from '../../../../l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';

const TypeSelect: React.FC<{
  disabled?: boolean;
  onChange: (value: ZetkinTag['value_type']) => void;
  value: ZetkinTag['value_type'];
}> = ({ disabled, onChange, value }) => {
  const messages = useMessages(messageIds);

  return (
    <Box mb={0.8} mt={1.5}>
      <FormControl
        data-testid="TypeSelect-formControl"
        disabled={disabled}
        variant="standard"
      >
        <FormLabel>
          <Msg id={messageIds.dialog.typeLabel} />
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
            label={messages.dialog.types.none()}
            value="none"
          />
          <FormControlLabel
            control={<Radio />}
            label={messages.dialog.types.text()}
            value="text"
          />
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default TypeSelect;
