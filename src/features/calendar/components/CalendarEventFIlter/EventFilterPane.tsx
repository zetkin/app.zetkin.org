import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { Clear, FilterList } from '@mui/icons-material';
import { useSelector, useStore } from 'react-redux';

import AllAndNoneToggle from './AllAndNoneToggle';
import EventTypesModel from 'features/events/models/EventTypesModel';
import messageIds from 'features/calendar/l10n/messageIds';
import PaneHeader from 'utils/panes/PaneHeader';
import { RootState } from 'core/store';
import useDebounce from 'utils/hooks/useDebounce';
import useModel from 'core/useModel';
import { useState } from 'react';
import ZUIFuture from 'zui/ZUIFuture';
import {
  ACTION_FILTER_OPTIONS,
  EventFilterOptions,
  FilterCategoryType,
  filterTextAdded,
  filterUpdated,
  STATE_FILTER_OPTIONS,
} from 'features/events/store';
import { Msg, useMessages } from 'core/i18n';

interface EventFilterPaneProps {
  orgId: number;
}
const EventFilterPane = ({ orgId }: EventFilterPaneProps) => {
  const messages = useMessages(messageIds);
  const store = useStore<RootState>();
  const state = useSelector((state: RootState) => state.events.filters);
  const typesModel = useModel((env) => new EventTypesModel(env, orgId));
  const [expand, setExpand] = useState(false);
  const [userInput, setUserInput] = useState<string>('');

  const handleCheckBox = (
    e: React.ChangeEvent<HTMLInputElement>,
    filterCategory: FilterCategoryType
  ) => {
    const { name } = e.target;
    store.dispatch(
      filterUpdated({
        filterCategory,
        selectedFilterValue: [
          filterCategory === 'selectedTypes'
            ? parseInt(name)
            : (name as EventFilterOptions),
        ],
      })
    );
  };

  const resetFilters = () => {
    const filterCategories: FilterCategoryType[] = [
      'selectedActions',
      'selectedStates',
      'selectedTypes',
    ];
    filterCategories.map((filterCategory) =>
      store.dispatch(
        filterUpdated({
          filterCategory: filterCategory,
          selectedFilterValue: [],
        })
      )
    );
  };

  const debouncedFinishedTyping = useDebounce(async (value: string) => {
    store.dispatch(filterTextAdded({ filterText: value }));
  }, 400);

  return (
    <>
      <PaneHeader title={messages.eventFilter.filter()} />
      <Button
        color="warning"
        onClick={resetFilters}
        size="small"
        variant="outlined"
      >
        <Msg id={messageIds.eventFilter.reset} />
      </Button>
      <Box sx={{ mt: 2 }}>
        <TextField
          fullWidth
          InputProps={{
            endAdornment: (
              <>
                {userInput && (
                  <IconButton
                    onClick={() => {
                      setUserInput('');
                      debouncedFinishedTyping('');
                    }}
                  >
                    <Clear />
                  </IconButton>
                )}
              </>
            ),
            startAdornment: (
              <InputAdornment position="start">
                <FilterList />
              </InputAdornment>
            ),
          }}
          onChange={(e) => {
            setUserInput(e.target.value);
            debouncedFinishedTyping(e.target.value);
          }}
          placeholder={messages.eventFilter.type()}
          value={userInput}
        />
        <Box display="flex" flexDirection="column" sx={{ mt: 2 }}>
          <FormGroup sx={{ mb: 2 }}>
            <Box
              alignItems="center"
              display="flex"
              justifyContent="space-between"
            >
              <Typography color="secondary" variant="body1">
                <Msg
                  id={messageIds.eventFilter.filterOptions.actionFilters.title}
                />
              </Typography>
              <AllAndNoneToggle
                filterCategory="selectedActions"
                selectedFilterLength={state.selectedActions.length}
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

                if (!message) {
                  return null;
                }

                return (
                  <FormControlLabel
                    key={enumValue}
                    control={
                      <Checkbox
                        checked={state.selectedActions.includes(enumValue)}
                        name={enumValue}
                        onChange={(e) => handleCheckBox(e, 'selectedActions')}
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
              alignItems="center"
              display="flex"
              justifyContent="space-between"
            >
              <Typography color="secondary" variant="body1">
                <Msg
                  id={messageIds.eventFilter.filterOptions.stateFilters.title}
                />
              </Typography>
              <AllAndNoneToggle
                filterCategory="selectedStates"
                selectedFilterLength={state.selectedStates.length}
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

                if (!message) {
                  return null;
                }

                return (
                  <FormControlLabel
                    key={enumValue}
                    control={
                      <Checkbox
                        checked={state.selectedStates.includes(enumValue)}
                        name={enumValue}
                        onChange={(e) => handleCheckBox(e, 'selectedStates')}
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
            <ZUIFuture future={typesModel.getTypes()}>
              {(data) => {
                const types =
                  expand || data.length <= 5 ? data : data.slice(0, 5);

                return (
                  <>
                    <Box
                      alignItems="center"
                      display="flex"
                      justifyContent="space-between"
                    >
                      <Typography color="secondary" variant="body1">
                        <Msg
                          id={
                            messageIds.eventFilter.filterOptions.eventTypes
                              .title
                          }
                        />
                      </Typography>
                      <AllAndNoneToggle
                        filterCategory="selectedTypes"
                        selectedFilterLength={state.selectedTypes.length}
                        types={data.map((item) => item.id)}
                      />
                    </Box>
                    {types.map((type) => {
                      return (
                        <FormControlLabel
                          key={type.id}
                          control={
                            <Checkbox
                              checked={state.selectedTypes.includes(type.id)}
                              name={`${type.id}`}
                              onChange={(e) =>
                                handleCheckBox(e, 'selectedTypes')
                              }
                            />
                          }
                          label={type.title}
                          sx={{ pl: 1 }}
                        />
                      );
                    })}
                    <Button
                      onClick={() => setExpand(!expand)}
                      sx={{ display: 'flex', justifyContent: 'flex-start' }}
                      variant="text"
                    >
                      {expand && <Msg id={messageIds.eventFilter.collapse} />}
                      {!expand && data.length - 5 > 0 && (
                        <Typography
                          sx={{ textDecoration: 'underline' }}
                          variant="body2"
                        >
                          <Msg
                            id={messageIds.eventFilter.expand}
                            values={{ numOfOptions: data.length - 5 }}
                          />
                        </Typography>
                      )}
                    </Button>
                  </>
                );
              }}
            </ZUIFuture>
          </FormGroup>
        </Box>
      </Box>
    </>
  );
};

export default EventFilterPane;
