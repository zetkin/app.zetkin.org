import { ChangeEvent } from 'react';
import { FilterListOutlined } from '@mui/icons-material';
import {
  Box,
  Card,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
} from '@mui/material';

import { ACTIVITIES } from 'features/campaigns/types';
import messageIds from 'features/campaigns/l10n/messageIds';
import useDebounce from 'utils/hooks/useDebounce';
import { useMessages } from 'core/i18n';

interface FilterActivitiesProps {
  filters: ACTIVITIES[];
  filterTypes: ACTIVITIES[];
  onFiltersChange: (evt: ChangeEvent<HTMLInputElement>) => void;
  onSearchStringChange: (value: string) => void;
}

const FilterActivities = ({
  filters,
  filterTypes,
  onFiltersChange,
  onSearchStringChange,
}: FilterActivitiesProps) => {
  const messages = useMessages(messageIds);

  const debouncedFinishedTyping = useDebounce(
    async (evt: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      onSearchStringChange(evt.target.value);
    },
    400
  );

  return (
    <Card>
      <Box padding={2}>
        <TextField
          fullWidth
          InputProps={{
            startAdornment: (
              <FilterListOutlined
                color="secondary"
                sx={{ marginRight: '0.5em' }}
              />
            ),
          }}
          onChange={(e) => debouncedFinishedTyping(e)}
          placeholder={messages.singleProject.filterActivities()}
        />
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.includes(ACTIVITIES.SURVEY)}
                disabled={!filterTypes.includes(ACTIVITIES.SURVEY)}
                onChange={onFiltersChange}
                value={ACTIVITIES.SURVEY}
              />
            }
            label={messages.all.filter.surveys()}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.includes(ACTIVITIES.CALL_ASSIGNMENT)}
                disabled={!filterTypes.includes(ACTIVITIES.CALL_ASSIGNMENT)}
                onChange={onFiltersChange}
                value={ACTIVITIES.CALL_ASSIGNMENT}
              />
            }
            label={messages.all.filter.calls()}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.includes(ACTIVITIES.TASK)}
                disabled={!filterTypes.includes(ACTIVITIES.TASK)}
                onChange={onFiltersChange}
                value={ACTIVITIES.TASK}
              />
            }
            label={messages.tasks()}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.includes(ACTIVITIES.EVENT)}
                disabled={!filterTypes.includes(ACTIVITIES.EVENT)}
                onChange={onFiltersChange}
                value={ACTIVITIES.EVENT}
              />
            }
            label={messages.events()}
          />
        </FormGroup>
      </Box>
    </Card>
  );
};

export default FilterActivities;
