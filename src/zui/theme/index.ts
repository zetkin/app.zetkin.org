import { createTheme } from '@mui/material';
import { Localization as DataGridLocalization } from '@mui/x-data-grid/utils/getGridLocalization';
import {
  daDK as dataGridDaDK,
  deDE as dataGridDeDE,
  nbNO as dataGridNbNO,
  svSE as dataGridSvSE,
} from '@mui/x-data-grid-pro';
import {
  daDK as pickersDaDK,
  deDE as pickersDeDE,
  nbNO as pickersNbNO,
  svSE as pickersSvSE,
} from '@mui/x-date-pickers-pro/locales';
import { daDK, deDE, Localization, nbNO, svSE } from '@mui/material/locale';

import './types';
import typography from './typography';
import { darkPalette, palette } from './palette';

const theme = createTheme({
  elevation: {
    bottom: {
      big: {
        light: '0rem 0.25rem 2.5rem 0rem #00000014',
        medium: '0rem 0.25rem 2.5rem 0rem #0000001F',
      },
      small: {
        light: '0rem 0.25rem 1.25rem 0rem #00000014',
        medium: '0rem 0.25rem 1.25rem 0rem #0000001F',
      },
    },
    top: {
      big: {
        light: '0.rem -0.25rem 2.25rem 0rem #00000014',
        medium: '0rem -0.25rem 2.25rem 0rem #0000001F',
      },
      small: {
        light: '0rem -0.25rem 1.25rem 0rem #00000014',
        medium: '0rem -0.25rem 1.25rem 0rem #0000001F',
      },
    },
  },
  palette: palette,
  typography: typography,
});

//MUI Material localizations
const coreLocales: Record<string, Localization> = {};
coreLocales['da'] = daDK;
coreLocales['de'] = deDE;
coreLocales['nn'] = nbNO;
coreLocales['sv'] = svSE;

//MUI Data Grid  localizations
const dataGridLocales: Record<string, DataGridLocalization> = {};
dataGridLocales['da'] = dataGridDaDK;
dataGridLocales['de'] = dataGridDeDE;
dataGridLocales['nn'] = dataGridNbNO;
dataGridLocales['sv'] = dataGridSvSE;

//MUI Date Pickers localizations
const pickersLocales: Record<string, typeof pickersDaDK> = {};
pickersLocales['da'] = pickersDaDK;
pickersLocales['de'] = pickersDeDE;
pickersLocales['nn'] = pickersNbNO;
pickersLocales['sv'] = pickersSvSE;

export const themeWithLocale = (lang?: string) => {
  return createTheme(
    theme,
    ...(lang
      ? [coreLocales[lang], dataGridLocales[lang], pickersLocales[lang]]
      : [])
  );
};

export const darkThemeWithLocale = (lang?: string) => {
  return createTheme(
    {
      ...theme,
      palette: darkPalette,
    },
    ...(lang
      ? [coreLocales[lang], dataGridLocales[lang], pickersLocales[lang]]
      : [])
  );
};

export default theme;
