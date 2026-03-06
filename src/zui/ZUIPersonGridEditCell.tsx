import { Close, PersonAdd } from '@mui/icons-material';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  CircularProgress,
  InputBase,
  List,
  ListItem,
  ListItemButton,
  ListSubheader,
  Paper,
  Popper,
  Typography,
  useAutocomplete,
} from '@mui/material';
import { FC, HTMLAttributes, useEffect, useRef, useState } from 'react';

import { Msg, useMessages } from 'core/i18n';
import { usePersonSelect } from './ZUIPersonSelect';
import { ZetkinPerson } from 'utils/types/zetkin';
import ZUIPersonAvatar from 'zui/ZUIPersonAvatar';
import messageIds from './l10n/messageIds';

const ZUIPersonGridEditCell: FC<{
  cell?: (Partial<Omit<ZetkinPerson, 'id'>> & { id: number | null }) | null;
  onCreate: () => void;
  onUpdate: (person: ZetkinPerson | null) => void;
  removePersonLabel: string;
  restrictedMode?: boolean;
  suggestedPeople: ZetkinPerson[];
  suggestedPeopleLabel: string;
}> = ({
  cell,
  onCreate,
  onUpdate,
  removePersonLabel,
  restrictedMode: isRestrictedMode = false,
  suggestedPeople,
  suggestedPeopleLabel,
}) => {
  const messages = useMessages(messageIds);

  const query = useRouter().query;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [searching, setSearching] = useState(false);

  const orgId = parseInt(query.orgId as string);

  const [activeIndex, setActiveIndex] = useState<number>(Infinity);
  const scrollableRef = useRef<HTMLUListElement>(null);

  // Scroll when navigating using keyboard
  useEffect(() => {
    const scrollableElement = scrollableRef.current;
    const selectedElement = scrollableElement?.querySelector('.Mui-selected');

    if (selectedElement) {
      selectedElement.scrollIntoView();
    }
  }, [scrollableRef, activeIndex]);

  const personSelect = usePersonSelect({
    initialValue: '',
    onChange: (person) => {
      onUpdate(person);
      setSearching(false);
      setAnchorEl(null);
    },
    selectedPerson: null,
  });

  const autoComplete = useAutocomplete({
    ...personSelect.autoCompleteProps,
    disabled: isRestrictedMode,
  });

  let searchResults = autoComplete.groupedOptions as ZetkinPerson[];
  const showSuggestedPeople =
    !!suggestedPeople.length && (!cell?.id || searching);

  if (searchResults.length) {
    // Filter down suggestedPeople to only include search matches
    const matchingIds = searchResults.map((person) => person.id);
    suggestedPeople = suggestedPeople.filter((person) =>
      matchingIds.includes(person.id)
    );

    // Filter search results to exclude suggested people
    searchResults = searchResults.filter(
      (p) => !suggestedPeople.find((s) => s.id == p.id)
    );
  }

  // Filter if the input value exists in suggested people list
  const filteredSuggestedPeople =
    personSelect.autoCompleteProps.inputValue === ''
      ? suggestedPeople
      : suggestedPeople.filter(
          (p) =>
            p.first_name
              .toLocaleLowerCase()
              .includes(autoComplete.inputValue.toLocaleLowerCase()) ||
            p.last_name
              .toLocaleLowerCase()
              .includes(autoComplete.inputValue.toLocaleLowerCase()) ||
            p.email
              ?.toLocaleLowerCase()
              .includes(autoComplete.inputValue.toLocaleLowerCase())
        );

  return (
    <Box
      onMouseEnter={(ev) => {
        setAnchorEl(ev.currentTarget);
      }}
      onMouseLeave={() => {
        setAnchorEl(null);
      }}
    >
      <Box ref={(div: HTMLDivElement) => setAnchorEl(div)}>
        <InputBase
          /* eslint-disable-next-line jsx-a11y/no-autofocus */
          autoFocus
          fullWidth
          inputProps={autoComplete.getInputProps()}
          onChange={() => setSearching(true)}
          onKeyDown={(ev) => {
            if (ev.code == 'ArrowUp') {
              const nextIndex = activeIndex - 1;
              setActiveIndex(
                nextIndex >= 0
                  ? nextIndex
                  : searchResults.length + suggestedPeople.length - 1
              );
            } else if (ev.code == 'ArrowDown') {
              const nextIndex = activeIndex + 1;
              setActiveIndex(
                nextIndex < searchResults.length + suggestedPeople.length
                  ? nextIndex
                  : 0
              );
            } else if (ev.code == 'Enter') {
              if (activeIndex < suggestedPeople.length) {
                onUpdate(suggestedPeople[activeIndex]);
              } else {
                onUpdate(searchResults[activeIndex - suggestedPeople.length]);
              }

              setActiveIndex(Infinity);
              setAnchorEl(null);
              ev.preventDefault();
            }
          }}
          placeholder={messages.personSelect.search()}
          sx={{ paddingLeft: '10px' }}
        />
      </Box>

      {suggestedPeople.length || autoComplete.inputValue != '' ? (
        <Popper
          anchorEl={anchorEl}
          open={!!anchorEl}
          popperOptions={{
            placement: 'bottom',
          }}
        >
          <Paper
            elevation={2}
            onClick={(ev) => {
              ev.stopPropagation();
              anchorEl?.focus();
            }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: isRestrictedMode ? 'auto' : '400px',
              width: '300px',
            }}
          >
            {isRestrictedMode && (
              <Box
                alignItems="center"
                display="flex"
                flexDirection="column"
                gap={1}
                justifyContent="center"
                width="100%"
              >
                {!!cell && (
                  <SelectedPerson orgId={orgId} person={cell as ZetkinPerson} />
                )}
                <Typography fontStyle="italic" variant="caption">
                  {messages.personGridEditCell.restrictedMode()}
                </Typography>
              </Box>
            )}
            {!isRestrictedMode && (
              <Box display="flex" flexDirection="column" height="100%">
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    height: 'calc(100% - 10px)',
                    justifyContent: 'center',
                    minWidth: '290px',
                    width: '100%',
                  }}
                >
                  {!!cell?.id && (
                    <Box
                      alignItems="center"
                      display="flex"
                      flexDirection="column"
                      gap={1}
                      justifyContent="center"
                    >
                      {!isRestrictedMode && !searching && (
                        <>
                          <SelectedPerson
                            orgId={orgId}
                            person={cell as ZetkinPerson}
                          />
                          <Button
                            endIcon={<Close />}
                            onClick={() => onUpdate(null)}
                            sx={{
                              cursor: 'pointer',
                            }}
                          >
                            {removePersonLabel}
                          </Button>
                        </>
                      )}
                    </Box>
                  )}
                  <List
                    ref={scrollableRef}
                    sx={{
                      display:
                        showSuggestedPeople || searching ? 'block' : 'none',
                      height: 'calc(100% - 40px)',
                      minWidth: '250px',
                      overflowY: 'scroll',
                      paddingLeft: '20px',
                      position: 'absolute',
                      width: '100%',
                    }}
                  >
                    {showSuggestedPeople && filteredSuggestedPeople.length > 0 && (
                      <>
                        <ListSubheader
                          disableSticky={true}
                          sx={{ marginTop: 0, paddingTop: 0 }}
                        >
                          {suggestedPeopleLabel}
                        </ListSubheader>
                        {filteredSuggestedPeople.map((option, index) => (
                          <PersonListItem
                            key={option.id}
                            itemProps={{
                              onClick: () => {
                                onUpdate(option);
                              },
                            }}
                            orgId={orgId}
                            person={option}
                            selected={activeIndex == index}
                          />
                        ))}
                      </>
                    )}
                    {searching && (
                      <List
                        {...autoComplete.getListboxProps()}
                        subheader={
                          <ListSubheader sx={{ position: 'relative' }}>
                            {searchResults.length > 0 &&
                              messages.personGridEditCell.searchResults()}
                            {autoComplete.inputValue &&
                              searchResults.length === 0 &&
                              autoComplete.inputValue.length < 3 &&
                              autoComplete.inputValue.length > 0 &&
                              messages.personGridEditCell.keepTyping()}
                            {autoComplete.inputValue.length >= 3 &&
                              !personSelect.autoCompleteProps.isLoading &&
                              searchResults.length === 0 &&
                              messages.personGridEditCell.noResult()}
                          </ListSubheader>
                        }
                      >
                        {personSelect.autoCompleteProps.isLoading && (
                          <CircularProgress
                            sx={{ display: 'block', margin: 'auto' }}
                          />
                        )}

                        {searchResults.map((option, index) => {
                          return (
                            <PersonListItem
                              key={option.id}
                              itemProps={{
                                onClick: () => {
                                  onUpdate(option);
                                },
                              }}
                              orgId={orgId}
                              person={option}
                              selected={
                                index + suggestedPeople.length == activeIndex
                              }
                            />
                          );
                        })}

                        {autoComplete.inputValue.length >= 3 &&
                          !personSelect.autoCompleteProps.isLoading && (
                            <Button
                              color="primary"
                              onClick={onCreate}
                              startIcon={<PersonAdd />}
                              sx={{
                                justifyContent: 'flex-start',
                                m: 2,
                              }}
                              variant="outlined"
                            >
                              <Msg id={messageIds.createPerson.createBtn} />
                            </Button>
                          )}
                      </List>
                    )}
                  </List>
                </Box>
              </Box>
            )}
          </Paper>
        </Popper>
      ) : null}
    </Box>
  );
};

const PersonListItem: FC<{
  itemProps: HTMLAttributes<HTMLLIElement>;
  orgId: number;
  person: ZetkinPerson;
  selected: boolean;
}> = ({ itemProps, orgId, person, selected }) => {
  return (
    <ListItem
      {...itemProps}
      disablePadding
      sx={{ paddingBottom: 0.5, paddingTop: 0.5 }}
    >
      <ListItemButton selected={selected}>
        <Box
          sx={{
            cursor: 'pointer',
            display: 'flex',
            gap: 1,
            justifyContent: 'center',
          }}
        >
          <ZUIPersonAvatar orgId={orgId} personId={person.id} size="sm" />
          <Typography component="span">
            {`${person.first_name} ${person.last_name}`}
          </Typography>
        </Box>
      </ListItemButton>
    </ListItem>
  );
};

const SelectedPerson: FC<{ orgId: number; person: ZetkinPerson }> = ({
  orgId,
  person,
}) => {
  return (
    <>
      <ZUIPersonAvatar orgId={orgId} personId={person.id} size="lg" />
      <Typography>{`${person.first_name} ${person.last_name}`}</Typography>
    </>
  );
};

export default ZUIPersonGridEditCell;
