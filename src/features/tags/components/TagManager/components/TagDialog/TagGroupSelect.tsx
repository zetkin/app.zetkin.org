import { Autocomplete } from '@mui/material';
import { createFilterOptions } from '@mui/material/useAutocomplete';
import { Box, TextField } from '@mui/material';

import { NewTagGroup } from '../../types';
import { ZetkinTagGroup } from 'utils/types/zetkin';

import messageIds from '../../../../l10n/messageIds';
import { useMessages } from 'core/i18n';

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
  const messages = useMessages(messageIds);

  return (
    <Box mb={0.8} mt={1.5}>
      <Autocomplete
        filterOptions={(options, params) => {
          const filtered = filter(options, params);
          // Suggest the creation of a new value
          if (params.inputValue !== '') {
            filtered.push({
              inputValue: params.inputValue,
              title: messages.dialog.groupCreatePrompt({
                groupName: params.inputValue,
              }),
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
            label={messages.dialog.groupLabel()}
            placeholder={messages.dialog.groupSelectPlaceholder()}
            variant="outlined"
          />
        )}
        value={value}
      />
    </Box>
  );
};

export default TagGroupSelect;
