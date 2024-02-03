import { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from '@mui/material';

import AllAndNoneToggle from './AllAndNoneToggle';
import { EventFilterOptions } from 'features/events/store';
import messageIds from 'features/calendar/l10n/messageIds';
import { Msg } from 'core/i18n';

interface CheckboxFilterListProps {
  onFilterChange: (value: string[]) => void;
  maxCollapsed: number;
  options: { label: string; value: string }[];
  selectedValues: EventFilterOptions[];
  title: string;
}
const CheckboxFilterList = ({
  maxCollapsed,
  onFilterChange,
  options,
  selectedValues,
  title,
}: CheckboxFilterListProps) => {
  const [expand, setExpand] = useState(false);

  const visibleOptions = expand ? options : options.slice(0, maxCollapsed);
  return (
    <FormGroup sx={{ mb: 2 }}>
      <Box alignItems="center" display="flex" justifyContent="space-between">
        <Typography color="secondary" variant="body1">
          {title}
        </Typography>
        <AllAndNoneToggle
          maxLength={options.length}
          onSelectAll={() => onFilterChange(options.map((item) => item.value))}
          onSelectNone={() => onFilterChange([])}
          selectedFilterLength={selectedValues.length}
        />
      </Box>
      {visibleOptions.map((item) => {
        return (
          <FormControlLabel
            key={item.value}
            control={
              <Checkbox
                checked={selectedValues.includes(item.value)}
                name={item.value}
                onChange={() => {
                  const alreadyExists = selectedValues.includes(item.value);
                  onFilterChange(
                    alreadyExists
                      ? selectedValues.filter(
                          (filterOption) => filterOption !== item.value
                        )
                      : [...selectedValues, item.value]
                  );
                }}
              />
            }
            label={item.label}
            sx={{ pl: 1 }}
          />
        );
      })}
      {options.length > maxCollapsed && (
        <Button
          onClick={() => setExpand(!expand)}
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            width: 'fit-content',
          }}
          variant="text"
        >
          {expand && <Msg id={messageIds.eventFilter.collapse} />}
          {!expand && (
            <Typography sx={{ textDecoration: 'underline' }} variant="body2">
              <Msg
                id={messageIds.eventFilter.expand}
                values={{ numOfOptions: options.length - maxCollapsed }}
              />
            </Typography>
          )}
        </Button>
      )}
    </FormGroup>
  );
};

export default CheckboxFilterList;
