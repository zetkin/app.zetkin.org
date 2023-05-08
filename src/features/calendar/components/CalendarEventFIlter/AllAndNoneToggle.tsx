import { Box, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';

import messageIds from 'features/calendar/l10n/messageIds';
import { Msg } from 'core/i18n';
import {
  ACTION_FILTER_OPTIONS,
  filterUpdated,
  STATE_FILTER_OPTIONS,
} from 'features/events/store';
import { useStore } from 'react-redux';
import { RootState } from 'core/store';

interface AllAndNoneToggleProps {
  filterCategory: string;
  selectedFilterLength: number;
}
const AllAndNoneToggle = ({
  filterCategory,
  selectedFilterLength,
}: AllAndNoneToggleProps) => {
  const [disabledAll, setDisabledAll] = useState<boolean>(false);
  const [disabledNone, setDisabledNone] = useState<boolean>(false);
  const store = useStore<RootState>();

  const selectedCategory =
    filterCategory === 'actions' ? ACTION_FILTER_OPTIONS : STATE_FILTER_OPTIONS;

  useEffect(() => {
    selectedFilterLength === 0 ? setDisabledNone(true) : setDisabledNone(false);

    selectedFilterLength === Object.keys(selectedCategory).length
      ? setDisabledAll(true)
      : setDisabledAll(false);
  }, [selectedFilterLength]);

  const handleSelectAll = (filterCategory: string) => {
    const options = Object.values(selectedCategory);
    store.dispatch(
      filterUpdated({
        filterCategory,
        selectedFilterValue: options,
      })
    );
  };

  const handleSelectNone = (filterCategory: string) => {
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
        variant="text"
        onClick={() => {
          handleSelectAll(filterCategory);
        }}
      >
        <Msg id={messageIds.eventFilter.toggle.all} />
      </Button>
      <Button
        disabled={disabledNone}
        variant="text"
        onClick={() => {
          handleSelectNone(filterCategory);
        }}
      >
        <Msg id={messageIds.eventFilter.toggle.none} />
      </Button>
    </Box>
  );
};

export default AllAndNoneToggle;
