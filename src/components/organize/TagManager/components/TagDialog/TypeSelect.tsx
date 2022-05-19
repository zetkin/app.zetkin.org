import { useIntl } from 'react-intl';
import { ZetkinTag } from 'types/zetkin';
import { Box, MenuItem, TextField } from '@material-ui/core';

const TypeSelect: React.FC<{
  onChange: (value: ZetkinTag['value_type']) => void;
  value: ZetkinTag['value_type'];
}> = ({ onChange, value }) => {
  const intl = useIntl();

  return (
    <Box mb={0.8} mt={1.5}>
      <TextField
        label={intl.formatMessage({
          id: 'misc.tags.tagManager.tagDialog.typeLabel',
        })}
        onChange={(ev) =>
          onChange(
            ev.target.value == 'none'
              ? null
              : (ev.target.value as ZetkinTag['value_type'])
          )
        }
        select
        style={{ width: '100%' }}
        value={value || 'none'}
        variant="outlined"
      >
        <MenuItem value="none">
          {intl.formatMessage({
            id: 'misc.tags.tagManager.tagDialog.types.none',
          })}
        </MenuItem>
        <MenuItem value="text">
          {intl.formatMessage({
            id: 'misc.tags.tagManager.tagDialog.types.text',
          })}
        </MenuItem>
      </TextField>
    </Box>
  );
};

export default TypeSelect;
