import timezones from 'timezones-list';
import { useState } from 'react';
import { Autocomplete, TextField, Typography } from '@mui/material';
import { Box, useTheme } from '@mui/system';

import messageIds from 'zui/l10n/messageIds';
import { useMessages } from 'core/i18n';

interface ZUITimezonePickerProps {
  onChange: (value: string) => void;
  scheduledTime?: string | null;
}

export const findCurrentTZ = () => {
  const tzCode = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return timezones.find((timezone) => timezone.tzCode === tzCode)!;
};

const ZUITimezonePicker = ({
  onChange,
  scheduledTime,
}: ZUITimezonePickerProps) => {
  const messages = useMessages(messageIds);
  const theme = useTheme();
  const currentTimezone = findCurrentTZ();
  const [value, setValue] = useState({
    cities: [currentTimezone.tzCode],
    utcValue: `${
      scheduledTime || currentTimezone.utc
    } ${messages.timezonePicker.gmt()}`,
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
          onChange(tzGroup.utcValue.split(' ')[0]);
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
                    <Typography sx={{ color: theme.palette.grey['800'] }}>
                      {`...${filteredCities[0]}`}
                    </Typography>
                    {restCities !== '' && (
                      <Typography sx={{ color: theme.palette.grey['500'] }}>
                        {`,${restCities}`}
                      </Typography>
                    )}
                  </Box>
                ) : (
                  <Typography sx={{ color: theme.palette.grey['800'] }}>
                    {option.cities.toString()}
                  </Typography>
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
