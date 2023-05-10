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
import messageIds from 'features/calendar/l10n/messageIds';
import { Msg } from 'core/i18n';
import { EventFilterOptions, FilterCategoryType } from 'features/events/store';

interface CheckboxFilterListProps {
  filterCategory: FilterCategoryType;
  onClickAll: (value: FilterCategoryType) => void;
  onClickCheckbox: (
    e: React.ChangeEvent<HTMLInputElement>,
    value: FilterCategoryType
  ) => void;
  onClickNone: (value: FilterCategoryType) => void;
  options: { label: string; value: string }[];
  state: EventFilterOptions[];
  title: string;
}
const CheckboxFilterList = ({
  onClickCheckbox,
  options,
  state,
  filterCategory,
  onClickAll,
  onClickNone,
  title,
}: CheckboxFilterListProps) => {
  const [expand, setExpand] = useState(false);

  const sortedTypes = options.slice(
    0,
    expand || options.length <= 5 ? options.length : 5
  );

  return (
    <>
      <FormGroup sx={{ mb: 2 }}>
        <Box alignItems="center" display="flex" justifyContent="space-between">
          <Typography color="secondary" variant="body1">
            {title}
          </Typography>
          <AllAndNoneToggle
            maxLength={options.length}
            onSelectAll={() => onClickAll(filterCategory)}
            onSelectNone={() => onClickNone(filterCategory)}
            selectedFilterLength={state.length}
          />
        </Box>
        {filterCategory != 'selectedTypes' &&
          options.map((item) => {
            return (
              <FormControlLabel
                key={item.value}
                control={
                  <Checkbox
                    checked={state.includes(item.value)}
                    name={item.value}
                    onChange={(e) => onClickCheckbox(e, filterCategory)}
                  />
                }
                label={item.label}
                sx={{ pl: 1 }}
              />
            );
          })}
        {filterCategory == 'selectedTypes' &&
          sortedTypes.map((item) => {
            return (
              <FormControlLabel
                key={item.value}
                control={
                  <Checkbox
                    checked={state.includes(item.value)}
                    name={item.value}
                    onChange={(e) => onClickCheckbox(e, filterCategory)}
                  />
                }
                label={item.label}
                sx={{ pl: 1 }}
              />
            );
          })}

        {options.length - 5 > 0 && (
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
                  values={{ numOfOptions: options.length - 5 }}
                />
              </Typography>
            )}
          </Button>
        )}
      </FormGroup>
    </>
  );
};

export default CheckboxFilterList;
