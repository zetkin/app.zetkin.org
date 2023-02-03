import { Autocomplete as MUIAutocomplete } from '@mui/material';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Box, TextField } from '@mui/material';
import React, {
  FunctionComponent,
  HTMLAttributes,
  MutableRefObject,
  ReactElement,
  useEffect,
  useState,
} from 'react';

import getPeopleSearchResults from 'utils/fetching/getPeopleSearchResults';
import useDebounce from 'utils/hooks/useDebounce';
import { ZetkinPerson } from 'utils/types/zetkin';
import ZUIPerson from 'zui/ZUIPerson';

interface UsePersonSelectProps {
  getOptionDisabled?: (option: ZetkinPerson) => boolean;
  getOptionExtraLabel?: (option: ZetkinPerson) => string;
  inputRef?: MutableRefObject<HTMLInputElement | undefined> | undefined;
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
    value: ZetkinPerson | null;
  };
}

type UsePersonSelect = (props: UsePersonSelectProps) => UsePersonSelectReturn;

type ZUIPersonSelectProps = UsePersonSelectProps & {
  size?: 'small' | 'medium';
  variant?: 'filled' | 'outlined' | 'standard';
};

export const usePersonSelect: UsePersonSelect = ({
  getOptionDisabled,
  getOptionExtraLabel,
  inputRef,
  label,
  name,
  onChange,
  placeholder,
  selectedPerson,
}) => {
  const intl = useIntl();
  const { orgId } = useRouter().query;
  const [searchFieldValue, setSearchFieldValue] = useState<string>('');

  const {
    isLoading,
    refetch,
    data: results,
  } = useQuery(
    ['peopleSearchResults', searchFieldValue],
    getPeopleSearchResults(searchFieldValue, orgId as string),
    { enabled: false }
  );

  let searchLabel = searchFieldValue.length
    ? intl.formatMessage({ id: 'misc.personSelect.keepTyping' })
    : intl.formatMessage({ id: 'misc.personSelect.search' });

  if (isLoading) {
    searchLabel = intl.formatMessage({ id: 'misc.personSelect.searching' });
  } else if (results?.length == 0) {
    searchLabel = intl.formatMessage({ id: 'misc.personSelect.noResult' });
  }

  const debouncedQuery = useDebounce(async () => {
    refetch();
  }, 600);

  // Watch for changes on the search field value and debounce search if changed
  useEffect(() => {
    if (searchFieldValue.length >= 3) {
      debouncedQuery();
    }
  }, [searchFieldValue.length, debouncedQuery]);

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
      label,
      name: name || '',
      noOptionsText: searchLabel,
      onChange: (ev, value) => {
        setSearchFieldValue('');
        onChange(value as ZetkinPerson);
      },
      onInputChange: (ev: unknown, value: string) => {
        setSearchFieldValue(value);
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
      value: selectedPerson,
    },
  };
};

const MUIOnlyPersonSelect: FunctionComponent<ZUIPersonSelectProps> = (
  props
) => {
  const { label, size, variant, ...restComponentProps } = props;
  const { autoCompleteProps } = usePersonSelect(restComponentProps);

  const { name, placeholder, inputRef, ...restProps } = autoCompleteProps;

  delete restProps.getOptionValue;

  return (
    <MUIAutocomplete
      {...restProps}
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
  );
};

export { MUIOnlyPersonSelect };
