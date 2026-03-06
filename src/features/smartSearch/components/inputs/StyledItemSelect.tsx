import {
  Autocomplete,
  AutocompleteProps,
  Box,
  Chip,
  TextField,
  Tooltip,
} from '@mui/material';

import { getEllipsedString } from 'utils/stringUtils';
import { Msg } from 'core/i18n';
import messageIds from 'features/smartSearch/l10n/messageIds';
import oldTheme from 'theme';

interface StyledItem {
  id: number;
  title: string;
  group?: { title: string } | null;
}

type StyledItemSelectProps = Omit<
  AutocompleteProps<StyledItem, true, true, false>,
  'renderInput'
> & { noOptionsText?: JSX.Element };

const StyledItemSelect = (props: StyledItemSelectProps): JSX.Element => {
  return (
    <Autocomplete
      disableClearable
      getOptionLabel={(item) => item.title}
      multiple
      noOptionsText={<Msg id={messageIds.misc.noOptions} />}
      renderInput={(params) => (
        <TextField
          sx={{
            display: 'inline',
            verticalAlign: 'inherit',
          }}
          {...params}
          slotProps={{
            htmlInput: {
              ...params.inputProps,
              className: '',
              sx: {
                fontSize: oldTheme.typography.h4.fontSize,
                padding: 0,
                width: '10rem',
              },
            },
          }}
          variant="standard"
        />
      )}
      renderOption={(optionProps, item) => {
        const title = item.title || '';
        const shortenedLabel = getEllipsedString(title, 15);
        return (
          <Box component="li" {...optionProps}>
            {shortenedLabel.length === title.length ? (
              <Chip
                key={item.id}
                color="primary"
                label={item.title}
                variant="outlined"
              />
            ) : (
              <Tooltip key={item.id} title={item.title}>
                <Chip
                  color="primary"
                  label={shortenedLabel}
                  variant="outlined"
                />
              </Tooltip>
            )}
          </Box>
        );
      }}
      renderTags={() => null}
      sx={{
        display: 'inline',
      }}
      {...props}
    />
  );
};

export default StyledItemSelect;
