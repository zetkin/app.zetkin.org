import timezones from 'timezones-list';
import { FC, useState } from 'react';
import {
  Autocomplete,
  Box,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';

import messageIds from 'zui/l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';

interface ZUITimezonePickerProps {
  onChange: (newTimeZone: string) => void;
  selectedTimeZone?: string | null;
}

export const findCurrentTZ = () => {
  const tzCode = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return timezones.find((timezone) => timezone.tzCode == tzCode)!;
};

const ZUITimeZonePicker: FC<ZUITimezonePickerProps> = ({
  onChange,
  selectedTimeZone,
}) => {
  const messages = useMessages(messageIds);
  const currentTimezone = findCurrentTZ();

  const [value, setValue] = useState({
    cities: [currentTimezone.tzCode],
    tzValue: `${
      selectedTimeZone || currentTimezone.utc
    } ${messages.timeZonePicker.gmt()}`,
  });

  const tzOptions = timezones.reduce(
    (acc: { cities: string[]; tzValue: string }[], timezone, index) => {
      const tzValue = `${timezone.utc} ${messages.timeZonePicker.gmt()}`;
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
      getOptionKey={(option) => `timezone-${option.tzValue}`}
      getOptionLabel={(option) => option.tzValue}
      isOptionEqualToValue={(option, value) => option.tzValue === value.tzValue}
      noOptionsText={
        <Typography sx={{ fontStyle: 'italic' }} variant="labelXlMedium">
          <Msg id={messageIds.timeZonePicker.noOptionsText} />
        </Typography>
      }
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
          label={messages.timeZonePicker.timeZone()}
          placeholder={messages.timeZonePicker.placeholder()}
          sx={(theme) => ({
            '& > label': {
              fontFamily: theme.typography.fontFamily,
              fontSize: '1rem',
              fontWeight: '500',
              letterSpacing: '3%',
            },
            '& > label[data-shrink="true"]': {
              color: theme.palette.secondary.main,
              fontSize: '0.813rem',
              transform: 'translate(0.813rem, -0.625rem)',
            },
            '& >.MuiInputBase-root > .MuiAutocomplete-endAdornment': {
              top: '50%',
            },
            '& >.MuiInputBase-root > fieldset > legend > span': {
              fontFamily: theme.typography.fontFamily,
              fontSize: '0.813rem',
              fontWeight: '500',
              letterSpacing: '3%',
              paddingLeft: '0.25rem',
              paddingRight: '0.25rem',
            },
            '& >.MuiOutlinedInput-root.MuiInputBase-sizeSmall': {
              paddingY: '0.438rem',
            },
          })}
        />
      )}
      renderOption={(props, option, state) => {
        const { key, ...optionProps } = props;

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
          <ListItem key={key} {...optionProps} divider={true}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <ListItemText
                disableTypography
                primary={
                  <Typography variant="labelXlMedium">
                    {option.tzValue}
                  </Typography>
                }
                secondary={
                  <Box
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {filteredCities.length == 0 && (
                      <Typography
                        sx={(theme) => ({
                          color: theme.palette.secondary.main,
                          fontFamily: theme.typography.fontFamily,
                          fontSize: '0.875rem',
                          fontWeight: 400,
                          letterSpacing: '3%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        })}
                      >
                        {option.cities.join(', ')}
                      </Typography>
                    )}
                    {filteredCities.length > 0 && (
                      <Box sx={{ display: 'flex' }}>
                        <Typography
                          sx={(theme) => ({
                            fontFamily: theme.typography.fontFamily,
                            fontSize: '0.875rem',
                            fontWeight: 400,
                            letterSpacing: '3%',
                          })}
                        >
                          {`...${filteredCities[0]}${
                            restCities.length > 0 ? ',' : ''
                          } `}
                        </Typography>
                        {restCities && (
                          <Typography
                            sx={(theme) => ({
                              color: theme.palette.secondary.main,
                              fontFamily: theme.typography.fontFamily,
                              fontSize: '0.875rem',
                              fontWeight: 400,
                              letterSpacing: '3%',
                              marginLeft: '0.125rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            })}
                          >
                            {restCities}
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Box>
                }
              />
            </Box>
          </ListItem>
        );
      }}
      size="small"
      sx={(theme) => ({
        '& input': {
          fontFamily: theme.typography.fontFamily,
          fontSize: '1rem',
          fontWeight: 400,
          letterSpacing: '3%',
        },
      })}
      value={{ cities: value.cities, tzValue: value.tzValue }}
    />
  );
};

export default ZUITimeZonePicker;
