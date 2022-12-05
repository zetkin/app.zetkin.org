import { useIntl } from 'react-intl';
import { Autocomplete } from '@mui/material';
import { createFilterOptions } from '@mui/material/useAutocomplete';
import { Box, TextField } from '@mui/material';

import { NewTagGroup } from '../../types';
import { ZetkinTagGroup } from 'utils/types/zetkin';

interface NewOption {
  inputValue: string;
  title: string;
}
type GroupOptions = ZetkinTagGroup | NewTagGroup | NewOption;

const filter = createFilterOptions<GroupOptions>();

const TagGroupSelect: React.FunctionComponent<{
  groups: ZetkinTagGroup[];
  onChange: (value: ZetkinTagGroup | NewTagGroup | null | undefined) => void;
  value: ZetkinTagGroup | NewTagGroup | null | undefined;
}> = ({ groups, value, onChange }) => {
  const intl = useIntl();

  return (
    <Box mb={0.8} mt={1.5}>
      <Autocomplete
        filterOptions={(options, params) => {
          const filtered = filter(options, params);
          // Suggest the creation of a new value
          if (params.inputValue !== '') {
            filtered.push({
              inputValue: params.inputValue,
              title: intl.formatMessage(
                {
                  id: 'misc.tags.tagManager.tagDialog.groupCreatePrompt',
                },
                {
                  groupName: params.inputValue,
                }
              ),
            });
          }

          return filtered;
        }}
        getOptionLabel={(group) => group.title}
        onChange={(e, newValue) => {
          if (newValue && 'inputValue' in newValue) {
            // Creating a new group with no id
            onChange({ title: (newValue as NewOption).inputValue });
          } else {
            // Selecting an existing group
            onChange(newValue);
          }
        }}
        options={(groups as GroupOptions[]) || []}
        renderInput={(params) => (
          <TextField
            {...params}
            inputProps={{
              ...params.inputProps,
              'data-testid': 'TagManager-TagDialog-tagGroupSelect',
            }}
            label={intl.formatMessage({
              id: 'misc.tags.tagManager.tagDialog.groupLabel',
            })}
            placeholder={intl.formatMessage({
              id: 'misc.tags.tagManager.tagDialog.groupSelectPlaceholder',
            })}
            variant="outlined"
          />
        )}
        value={value}
      />
    </Box>
  );
};

export default TagGroupSelect;
