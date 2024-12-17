import { Box, TextField } from '@mui/material';
import {
  Button,
  Divider,
  Autocomplete as MUIAutocomplete,
  Paper,
} from '@mui/material';
import React, {
  FunctionComponent,
  HTMLAttributes,
  MutableRefObject,
  ReactElement,
  useEffect,
  useState,
} from 'react';
import { PersonAdd } from '@mui/icons-material';

import messageIds from './l10n/messageIds';
import { useNumericRouteParams } from 'core/hooks';
import usePersonSearch from 'features/profile/hooks/usePersonSearch';
import { ZetkinPerson } from 'utils/types/zetkin';
import ZUICreatePerson from './ZUICreatePerson';
import ZUIPerson from 'zui/ZUIPerson';
import { Msg, useMessages } from 'core/i18n';

interface UsePersonSelectProps {
  getOptionDisabled?: (option: ZetkinPerson) => boolean;
  getOptionExtraLabel?: (option: ZetkinPerson) => string | JSX.Element;
  inputRef?: MutableRefObject<HTMLInputElement | undefined> | undefined;
  initialValue?: string;
  label?: string;
  name?: string;
  onChange: (person: ZetkinPerson) => void;
  placeholder?: string;
  selectedPerson: ZetkinPerson | null;
}

interface UsePersonSelectReturn {
  autoCompleteProps: {
    filterOptions: (options: ZetkinPerson[]) => ZetkinPerson[];
    getOptionDisabled?: (option: ZetkinPerson) => boolean;
    getOptionLabel: (person: ZetkinPerson) => string;
    getOptionSelected: (option: ZetkinPerson, value: ZetkinPerson) => boolean;
    getOptionValue?: (person: ZetkinPerson) => unknown;
    inputRef: MutableRefObject<HTMLInputElement | undefined> | undefined;
    inputValue: string | undefined;
    isLoading: boolean;
    label: string | undefined;
    name: string;
    noOptionsText: string;
    onChange: (
      ev: unknown,
      value: string | ZetkinPerson | (string | ZetkinPerson)[] | null
    ) => void;
    onInputChange: (ev: unknown, value: string) => void;
    options: ZetkinPerson[];
    placeholder?: string;
    renderOption: (
      props: HTMLAttributes<HTMLLIElement>,
      person: ZetkinPerson
    ) => ReactElement;
    shiftHeld: boolean;
    value: ZetkinPerson | null;
  };
}

type UsePersonSelect = (props: UsePersonSelectProps) => UsePersonSelectReturn;

type ZUIPersonSelectProps = UsePersonSelectProps & {
  disabled?: boolean;
  size?: 'small' | 'medium';
  submitLabel?: string;
  title?: string;
  variant?: 'filled' | 'outlined' | 'standard';
};

export const usePersonSelect: UsePersonSelect = ({
  getOptionDisabled,
  getOptionExtraLabel,
  inputRef,
  initialValue,
  label,
  name,
  onChange,
  placeholder,
  selectedPerson,
}) => {
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();
  const [searchFieldValue, setSearchFieldValue] = useState<string>(
    initialValue || ''
  );
  const [shiftHeld, setShiftHeld] = useState(false);

  const { isLoading, setQuery, results } = usePersonSearch(orgId);

  let searchLabel = searchFieldValue.length
    ? messages.personSelect.keepTyping()
    : messages.personSelect.search();

  if (isLoading) {
    searchLabel = messages.personSelect.searching();
  } else if (results?.length == 0) {
    searchLabel = messages.personSelect.noResult();
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Shift') {
      setShiftHeld(true);
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'Shift') {
      setShiftHeld(false);
    }
  };

  let personOptions = (results || []) as ZetkinPerson[];
  if (
    selectedPerson &&
    !personOptions.some((o) => o.id === selectedPerson.id)
  ) {
    personOptions = [selectedPerson as ZetkinPerson].concat(personOptions);
  }

  return {
    autoCompleteProps: {
      filterOptions: (options) => options,
      getOptionDisabled,
      getOptionLabel: (person: ZetkinPerson) => `${person.id}`,
      getOptionSelected: (option: ZetkinPerson, value: ZetkinPerson) =>
        option?.id == value?.id,
      getOptionValue: (person: ZetkinPerson) => person.id || null,
      inputRef,
      inputValue: searchFieldValue,
      isLoading,
      label,
      name: name || '',
      noOptionsText: searchLabel,
      onChange: (ev, value) => {
        setSearchFieldValue('');
        setQuery('');
        onChange(value as ZetkinPerson);
      },
      onInputChange: (ev: unknown, value: string) => {
        if (ev !== null) {
          setSearchFieldValue(value);
          setQuery(value);
        }
      },
      options: personOptions,
      placeholder,
      renderOption: (
        props: HTMLAttributes<HTMLLIElement>,
        person: ZetkinPerson
      ) => {
        const extraLabel = getOptionExtraLabel
          ? getOptionExtraLabel(person)
          : null;
        const name = `${person.first_name} ${person.last_name}`;
        return (
          <Box component="li" {...props}>
            <ZUIPerson id={person.id} name={name} subtitle={extraLabel} />
          </Box>
        );
      },
      shiftHeld,
      value: selectedPerson,
    },
  };
};

const MUIOnlyPersonSelect: FunctionComponent<ZUIPersonSelectProps> = (
  props
) => {
  const {
    disabled,
    label,
    size,
    variant,
    submitLabel,
    title,
    ...restComponentProps
  } = props;
  const { autoCompleteProps } = usePersonSelect(restComponentProps);

  const { name, placeholder, inputRef, shiftHeld, onChange, ...restProps } =
    autoCompleteProps;
  delete restProps.getOptionValue;

  const [createPersonOpen, setCreatePersonOpen] = useState(false);

  const [wasLoading, setWasLoading] = useState(false);

  useEffect(() => {
    if (autoCompleteProps.isLoading) {
      // Set wasLoading to true when the autocomplete is loading
      // this value stays true even after isLoading is false again
      setWasLoading(true);
    }
  }, [autoCompleteProps.isLoading]);

  return (
    <>
      <MUIAutocomplete
        {...restProps}
        handleHomeEndKeys={!shiftHeld}
        onChange={(ev, value) => {
          onChange(ev, value);
          // If a person is selected, we reset the wasLoading state to false
          // A new search has to be done to show the add person button again
          setWasLoading(false);
        }}
        PaperComponent={({ children }) => {
          return (
            <Paper
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              {children}
              {!disabled && wasLoading && (
                <>
                  <Divider sx={{ mt: 1 }} />
                  <Button
                    color="primary"
                    onClick={() => {
                      setCreatePersonOpen(true);
                      // If a person is added, we reset the wasLoading state to false
                      // A new search has to be done to show the add person button again
                      setWasLoading(false);
                    }}
                    startIcon={<PersonAdd />}
                    sx={{
                      justifyContent: 'flex-start',
                      m: 2,
                    }}
                    variant="outlined"
                  >
                    <Msg id={messageIds.createPerson.createBtn} />
                  </Button>
                </>
              )}
            </Paper>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            inputProps={{
              ...params.inputProps,
            }}
            inputRef={inputRef}
            label={label}
            name={name}
            placeholder={placeholder}
            size={size}
            variant={variant}
          />
        )}
      />
      <ZUICreatePerson
        onClose={() => setCreatePersonOpen(false)}
        onSubmit={(e, person) => onChange(e, person)}
        open={createPersonOpen}
        submitLabel={submitLabel}
        title={title}
      />
    </>
  );
};

export { MUIOnlyPersonSelect };
