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

import { ACTIVITIES } from 'features/campaigns/models/CampaignActivitiesModel';
import messageIds from 'features/campaigns/l10n/messageIds';
import { useMessages } from 'core/i18n';

interface FilterActivitiesProps {
  filters: ACTIVITIES[];
  onFiltersChange: (evt: ChangeEvent<HTMLInputElement>) => void;
  onSearchStringChange: (evt: ChangeEvent<HTMLInputElement>) => void;
  value: string;
}

const FilterActivities = ({
  filters,
  onFiltersChange,
  onSearchStringChange,
  value,
}: FilterActivitiesProps) => {
  const messages = useMessages(messageIds);

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
          onChange={onSearchStringChange}
          placeholder={messages.singleProject.filterActivities()}
          value={value}
        />
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.includes(ACTIVITIES.SURVEY)}
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
                onChange={onFiltersChange}
                value={ACTIVITIES.TASK}
              />
            }
            label={messages.tasks()}
          />
        </FormGroup>
      </Box>
    </Card>
  );
};

export default FilterActivities;
