import { Box } from '@mui/system';
import timezones from 'timezones-list';
import { useState } from 'react';
import { Autocomplete, TextField, Typography } from '@mui/material';

import messageIds from 'zui/l10n/messageIds';
import { useMessages } from 'core/i18n';

interface ZUITimezonePickerProps {
  onChange: (value: string) => void;
}

const ZUITimezonePicker = ({ onChange }: ZUITimezonePickerProps) => {
  const messages = useMessages(messageIds);
  const currentTzCode = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const currentTimezone = timezones.find(
    (timezone) => timezone.tzCode === currentTzCode
  )!;
  const [value, setValue] = useState({
    cities: [currentTimezone.tzCode],
    utcValue: `${currentTimezone.utc} ${messages.timezonePicker.gmt()}`,
  });

  const tzOptions = timezones.reduce(
    (acc: { cities: string[]; utcValue: string }[], timezone, index) => {
      const utcValue = `${timezone.utc} ${messages.timezonePicker.gmt()}`;
      const tzGroupIndex = acc.findIndex((item) => item.utcValue === utcValue);

      const city = timezone.tzCode
        .substring(timezone.tzCode.indexOf('/') + 1)
        .replaceAll('_', ' ');
      const hasTimezone = acc.some((item) => item.utcValue === utcValue);

      if (index === 0 || !hasTimezone) {
        acc.push({
          cities: [city],
          utcValue: utcValue,
        });
      } else {
        acc[tzGroupIndex].cities.push(city);
      }
      return acc;
    },
    []
  );

  return (
    <Autocomplete
      disableClearable
      filterOptions={(options, { inputValue }) => {
        const filtered = options.filter((item) =>
          item.cities.toString().toLocaleLowerCase().includes(inputValue)
        );
        return filtered || options;
      }}
      fullWidth
      getOptionLabel={(option) => option.utcValue}
      isOptionEqualToValue={(option, value) =>
        option.utcValue === value.utcValue
      }
      onChange={(_, tzGroup) => {
        if (tzGroup !== null) {
          setValue(tzGroup);
          onChange(tzGroup.utcValue);
        }
      }}
      options={tzOptions}
      placeholder={messages.timezonePicker.placeholder()}
      renderInput={(params) => (
        <TextField {...params} label={messages.timezonePicker.timezone()} />
      )}
      renderOption={(props, option, state) => {
        let filteredCities: string[] = [];
        const cityIdx = option.cities.findIndex((item) => {
          if (state.inputValue !== '') {
            return item.toLocaleLowerCase().includes(state.inputValue);
          }
        });

        if (cityIdx > -1) {
          filteredCities = option.cities.slice(cityIdx);
        }
        const restCities = filteredCities.slice(1).toString();

        return (
          <li {...props}>
            <Box
              key={`timezone-${option.utcValue}`}
              display="flex"
              flexDirection="column"
              sx={{
                overflow: 'hidden',
              }}
            >
              <Typography fontWeight="bold">{option.utcValue}</Typography>
              <Box
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {filteredCities.length > 0 ? (
                  <Box display="flex">
                    <Typography>...</Typography>
                    <Typography fontWeight="bold">{`${filteredCities[0]}`}</Typography>
                    {restCities !== '' && (
                      <Typography>{`,${restCities}`}</Typography>
                    )}
                  </Box>
                ) : (
                  option.cities.toString()
                )}
              </Box>
            </Box>
          </li>
        );
      }}
      value={{ cities: value.cities, utcValue: value.utcValue }}
    />
  );
};

export default ZUITimezonePicker;
