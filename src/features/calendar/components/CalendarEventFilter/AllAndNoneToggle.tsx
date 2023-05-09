import { Box, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';

import messageIds from 'features/calendar/l10n/messageIds';
import { Msg } from 'core/i18n';
import { RootState } from 'core/store';
import { useStore } from 'react-redux';
import {
  ACTION_FILTER_OPTIONS,
  FilterCategoryType,
  filterUpdated,
  STATE_FILTER_OPTIONS,
} from 'features/events/store';

interface AllAndNoneToggleProps {
  filterCategory: FilterCategoryType;
  selectedFilterLength: number;
  types?: number[];
}
const AllAndNoneToggle = ({
  filterCategory,
  selectedFilterLength,
  types,
}: AllAndNoneToggleProps) => {
  const [disabledAll, setDisabledAll] = useState<boolean>(false);
  const [disabledNone, setDisabledNone] = useState<boolean>(false);
  const store = useStore<RootState>();

  const selectedCategory =
    filterCategory === 'selectedActions'
      ? ACTION_FILTER_OPTIONS
      : STATE_FILTER_OPTIONS;

  useEffect(() => {
    selectedFilterLength === 0 ? setDisabledNone(true) : setDisabledNone(false);
    const maxLength = types
      ? types.length
      : Object.keys(selectedCategory).length;

    selectedFilterLength === maxLength
      ? setDisabledAll(true)
      : setDisabledAll(false);
  }, [selectedFilterLength]);

  const handleSelectAll = (filterCategory: FilterCategoryType) => {
    store.dispatch(
      filterUpdated({
        filterCategory,
        selectedFilterValue: types ? types : Object.values(selectedCategory),
      })
    );
  };

  const handleSelectNone = (filterCategory: FilterCategoryType) => {
    store.dispatch(
      filterUpdated({
        filterCategory,
        selectedFilterValue: [],
      })
    );
  };

  return (
    <Box display="flex">
      <Button
        disabled={disabledAll}
        onClick={() => {
          handleSelectAll(filterCategory);
        }}
        variant="text"
      >
        <Msg id={messageIds.eventFilter.toggle.all} />
      </Button>
      <Button
        disabled={disabledNone}
        onClick={() => {
          handleSelectNone(filterCategory);
        }}
        variant="text"
      >
        <Msg id={messageIds.eventFilter.toggle.none} />
      </Button>
    </Box>
  );
};

export default AllAndNoneToggle;
