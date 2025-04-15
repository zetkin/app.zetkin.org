import { Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FC, PropsWithChildren, useState } from 'react';
import { deDE, daDK, svSE, nnNO } from '@mui/x-date-pickers/locales';
import 'dayjs/locale/de';
import 'dayjs/locale/da';
import 'dayjs/locale/nn';
import 'dayjs/locale/sv';

const LocaleSwitcher: FC<PropsWithChildren> = ({ children }) => {
  const locales = ['en', 'da', 'sv', 'de', 'nn'];
  const localeTextsByLocale: Record<
    string,
    typeof daDK.components.MuiLocalizationProvider.defaultProps.localeText
  > = {
    da: daDK.components.MuiLocalizationProvider.defaultProps.localeText,
    de: deDE.components.MuiLocalizationProvider.defaultProps.localeText,
    nn: nnNO.components.MuiLocalizationProvider.defaultProps.localeText,
    sv: svSE.components.MuiLocalizationProvider.defaultProps.localeText,
  };

  type LocaleKey = typeof locales[number];
  const [locale, setLocale] = useState<LocaleKey>('en');

  return (
    <LocalizationProvider
      //Sets the date/time format
      adapterLocale={locale}
      dateAdapter={AdapterDayjs}
      //Sets the localized placeholder text
      localeText={localeTextsByLocale[locale]}
    >
      <Stack spacing={3} sx={{ width: 300 }}>
        <ToggleButtonGroup
          exclusive
          fullWidth
          onChange={(event, newLocale) => {
            if (newLocale != null) {
              setLocale(newLocale);
            }
          }}
          value={locale}
        >
          {locales.map((localeItem) => (
            <ToggleButton key={localeItem} value={localeItem}>
              {localeItem.toLocaleUpperCase()}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        {children}
      </Stack>
    </LocalizationProvider>
  );
};

export default LocaleSwitcher;
