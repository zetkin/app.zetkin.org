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
import ZUIFuture from 'zui/ZUIFuture';
import {
  ACTION_FILTER_OPTIONS,
  EventFilterOptions,
  FilterCategoryType,
  filterTextUpdated,
  filterUpdated,
  STATE_FILTER_OPTIONS,
} from 'features/events/store';
import { Msg, useMessages } from 'core/i18n';
import { useEffect, useState } from 'react';

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
  const [disableReset, setDisableReset] = useState<boolean>(
    state.selectedActions.length > 0 ||
      state.selectedStates.length > 0 ||
      state.selectedTypes.length > 0 ||
      state.text !== ''
  );

  useEffect(() => {
    if (
      state.selectedActions.length > 0 ||
      state.selectedStates.length > 0 ||
      state.selectedTypes.length > 0 ||
      state.text !== ''
    ) {
      setDisableReset(false);
    } else {
      setDisableReset(true);
    }
  }, [state]);

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
    store.dispatch(filterTextUpdated({ filterText: '' }));
    setUserInput('');
  };

  const debouncedFinishedTyping = useDebounce(async (value: string) => {
    store.dispatch(filterTextUpdated({ filterText: value }));
  }, 400);

  return (
    <>
      <PaneHeader title={messages.eventFilter.filter()} />
      <Button
        color="warning"
        disabled={disableReset}
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
              {Object.values(ACTION_FILTER_OPTIONS).map((value) => {
                return (
                  <FormControlLabel
                    key={value}
                    control={
                      <Checkbox
                        checked={state.selectedActions.includes(value)}
                        name={value}
                        onChange={(e) => handleCheckBox(e, 'selectedActions')}
                      />
                    }
                    label={
                      messageIds.eventFilter.filterOptions.actionFilters[value]
                        ._defaultMessage
                    }
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
              {Object.values(STATE_FILTER_OPTIONS).map((value) => {
                return (
                  <FormControlLabel
                    key={value}
                    control={
                      <Checkbox
                        checked={state.selectedStates.includes(value)}
                        name={value}
                        onChange={(e) => handleCheckBox(e, 'selectedStates')}
                      />
                    }
                    label={
                      messageIds.eventFilter.filterOptions.stateFilters[value]
                        ._defaultMessage
                    }
                    sx={{ pl: 1 }}
                  />
                );
              })}
            </>
          </FormGroup>
          <FormGroup sx={{ mb: 2 }}>
            <ZUIFuture future={typesModel.getTypes()}>
              {(data) => {
                //sorting everytime when user clicks
                const sortedTypes = data.sort((a, b) =>
                  a.title.toLowerCase().localeCompare(b.title.toLowerCase())
                );

                const types =
                  expand || data.length <= 5
                    ? sortedTypes
                    : sortedTypes.slice(0, 5);

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
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        width: 'fit-content',
                      }}
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
