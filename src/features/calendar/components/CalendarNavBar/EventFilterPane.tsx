import FilterListIcon from '@mui/icons-material/FilterList';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';

import PaneHeader from 'utils/panes/PaneHeader';
import messageIds from 'features/calendar/l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';
import AllAndNoneToggle from './AllAndNoneToggle';
import {
  ACTION_FILTER_OPTIONS,
  EventFilterOptions,
  filterAdded,
  filterRemoved,
  STATE_FILTER_OPTIONS,
} from 'features/events/store';
import { useSelector, useStore } from 'react-redux';
import { RootState } from 'core/store';

const EventFilterPane = () => {
  const messages = useMessages(messageIds);
  const store = useStore<RootState>();
  const state = useSelector((state: RootState) => state.events.filters); // <-- subscribe to changes

  const handleCheckBox = (
    e: React.ChangeEvent<HTMLInputElement>,
    filterCategory: string
  ) => {
    const { name } = e.target;

    // if (
    //   state.selectedActions.includes(name as ACTION_FILTER_OPTIONS) ||
    //   state.selectedStates.includes(name as STATE_FILTER_OPTIONS)
    // ) {
    //   store.dispatch(
    //     filterRemoved({
    //       filterCategory,
    //       selectedFilterValue: [name] as EventFilterOptions,
    //     })
    //   );
    // } else {
    //   store.dispatch(
    //     filterAdded({
    //       filterCategory,
    //       selectedFilterValue: [name] as EventFilterOptions,
    //     })
    //   );
    // }
    store.dispatch(
      filterAdded({
        filterCategory,
        selectedFilterValue: [name] as EventFilterOptions,
      })
    );
  };

  const handleSelectAll = (filterCategory: string) => {
    const options = Object.values(
      filterCategory === 'actions'
        ? ACTION_FILTER_OPTIONS
        : STATE_FILTER_OPTIONS
    );
    store.dispatch(
      filterAdded({
        filterCategory,
        selectedFilterValue: options as EventFilterOptions,
      })
    );
  };

  return (
    <>
      <PaneHeader title={messages.eventFilter.filter()} />
      <Button variant="outlined" size="small" color="warning">
        <Msg id={messageIds.eventFilter.reset} />
      </Button>
      <Box sx={{ mt: 2 }}>
        <TextField
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FilterListIcon />
              </InputAdornment>
            ),
          }}
          placeholder={messages.eventFilter.type()}
        />
        <Box sx={{ mt: 2 }} display="flex" flexDirection="column">
          <FormGroup sx={{ mb: 2 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body1" color="secondary">
                <Msg
                  id={messageIds.eventFilter.filterOptions.actionFilters.title}
                />
              </Typography>
              <AllAndNoneToggle
                filterCategory="actions"
                onClickAll={(filterCategory) => handleSelectAll(filterCategory)}
              />
            </Box>
            <>
              {Object.entries(ACTION_FILTER_OPTIONS).map((options) => {
                const enumKey = options[0];
                const enumValue = options[1];

                const entries = Object.entries(
                  messages.eventFilter.filterOptions.actionFilters
                );
                const lowerCaseKey = enumKey.toLowerCase();
                const message = entries.find(
                  (entry) => entry[0] === lowerCaseKey
                );

                if (!message) return;

                return (
                  <FormControlLabel
                    key={enumValue}
                    control={
                      <Checkbox
                        checked={state.selectedActions.includes(enumValue)}
                        name={enumValue}
                        onChange={(e) => handleCheckBox(e, 'actions')}
                      />
                    }
                    label={message[1]()}
                    sx={{ pl: 1 }}
                  />
                );
              })}
            </>
          </FormGroup>
          <FormGroup sx={{ mb: 2 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body1" color="secondary">
                <Msg
                  id={messageIds.eventFilter.filterOptions.stateFilters.title}
                />
              </Typography>
              <AllAndNoneToggle
                filterCategory="states"
                onClickAll={(filterCategory) => handleSelectAll(filterCategory)}
              />
            </Box>
            <>
              {Object.entries(STATE_FILTER_OPTIONS).map((options) => {
                const enumKey = options[0];
                const enumValue = options[1];

                const entries = Object.entries(
                  messages.eventFilter.filterOptions.stateFilters
                );
                const lowerCaseKey = enumKey.toLowerCase();
                const message = entries.find(
                  (entry) => entry[0] === lowerCaseKey
                );

                if (!message) return;

                return (
                  <FormControlLabel
                    key={enumValue}
                    control={
                      <Checkbox
                        checked={state.selectedStates.includes(enumValue)}
                        name={enumValue}
                        onChange={(e) => handleCheckBox(e, 'states')}
                      />
                    }
                    label={message[1]()}
                    sx={{ pl: 1 }}
                  />
                );
              })}
            </>
          </FormGroup>
        </Box>
      </Box>
    </>
  );
};

export default EventFilterPane;
