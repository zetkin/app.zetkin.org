import timezones from 'timezones-list';
import { useState } from 'react';
import { Autocomplete, Divider, TextField, Typography } from '@mui/material';
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
    tzValue: `${
      scheduledTime || currentTimezone.utc
    } ${messages.timezonePicker.gmt()}`,
  });

  const tzOptions = timezones.reduce(
    (acc: { cities: string[]; tzValue: string }[], timezone, index) => {
      const tzValue = `${timezone.utc} ${messages.timezonePicker.gmt()}`;
      const tzGroupIndex = acc.findIndex((item) => item.tzValue === tzValue);

      const city = timezone.tzCode
        .substring(timezone.tzCode.indexOf('/') + 1)
        .replaceAll('_', ' ');
      const hasTimezone = acc.some((item) => item.tzValue === tzValue);

      if (index === 0 || !hasTimezone) {
        acc.push({
          cities: [city],
          tzValue: tzValue,
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
      getOptionLabel={(option) => option.tzValue}
      isOptionEqualToValue={(option, value) => option.tzValue === value.tzValue}
      onChange={(_, tzGroup) => {
        if (tzGroup !== null) {
          setValue(tzGroup);
          onChange(tzGroup.tzValue.split(' ')[0]);
        }
      }}
      options={tzOptions}
      renderInput={(params) => (
        <TextField
          {...params}
          label={messages.timezonePicker.timezone()}
          placeholder={messages.timezonePicker.placeholder()}
        />
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
        const restCities = filteredCities.slice(1).join(', ');

        return (
          <Box key={`timezone-${option.tzValue}`}>
            <li {...props}>
              <Box
                display="flex"
                flexDirection="column"
                sx={{
                  overflow: 'hidden',
                }}
              >
                <Typography>{option.tzValue}</Typography>
                <Box
                  sx={{
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {filteredCities.length > 0 ? (
                    <Box display="flex">
                      <Typography
                        sx={{ color: theme.palette.grey['800'] }}
                        variant="body2"
                      >
                        {`...${filteredCities[0]}${
                          restCities.length > 0 && ','
                        }`}
                      </Typography>
                      {restCities !== '' && (
                        <Typography
                          sx={{ color: theme.palette.grey['500'], ml: 0.2 }}
                          variant="body2"
                        >
                          {`${restCities}`}
                        </Typography>
                      )}
                    </Box>
                  ) : (
                    <Typography
                      sx={{
                        color: theme.palette.grey['800'],
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      variant="body2"
                    >
                      {option.cities.join(', ')}
                    </Typography>
                  )}
                </Box>
              </Box>
            </li>
            <Divider />
          </Box>
        );
      }}
      value={{ cities: value.cities, tzValue: value.tzValue }}
    />
  );
};

export default ZUITimezonePicker;
