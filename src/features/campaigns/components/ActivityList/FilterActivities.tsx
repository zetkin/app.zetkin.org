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
import { useMessages } from 'core/i18n';
import useFeature from 'utils/featureFlags/useFeature';
import { AREAS, TASKS } from 'utils/featureFlags';

interface FilterActivitiesProps {
  filters: ACTIVITIES[];
  filterTypes: ACTIVITIES[];
  onFiltersChange: (evt: ChangeEvent<HTMLInputElement>) => void;
  searchString?: string;
  onSearchStringChange: (value: string) => void;
}

const FilterActivities = ({
  filters,
  filterTypes,
  onFiltersChange,
  searchString,
  onSearchStringChange,
}: FilterActivitiesProps) => {
  const messages = useMessages(messageIds);
  const hasAreaAssignments = useFeature(AREAS);
  const hasTasks = useFeature(TASKS);

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
          onChange={(e) => onSearchStringChange(e.target.value)}
          placeholder={messages.singleProject.filterActivities()}
          value={searchString}
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
          {hasAreaAssignments && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.includes(ACTIVITIES.AREA_ASSIGNMENT)}
                  disabled={!filterTypes.includes(ACTIVITIES.AREA_ASSIGNMENT)}
                  onChange={onFiltersChange}
                  value={ACTIVITIES.AREA_ASSIGNMENT}
                />
              }
              label={messages.all.filter.areaAssignments()}
            />
          )}
          {hasTasks && (
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
          )}
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.includes(ACTIVITIES.EMAIL)}
                disabled={!filterTypes.includes(ACTIVITIES.EMAIL)}
                onChange={onFiltersChange}
                value={ACTIVITIES.EMAIL}
              />
            }
            label={messages.all.filter.emails()}
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
