import { createTheme } from '@mui/material';
import { Localization as DataGridLocalization } from '@mui/x-data-grid/utils/getGridLocalization';
import {
  daDK as dataGridDaDK,
  deDE as dataGridDeDE,
  nbNO as dataGridNbNO,
  svSE as dataGridSvSE,
  frFR as dataGridFrFR,
} from '@mui/x-data-grid-pro';
import {
  daDK as pickersDaDK,
  deDE as pickersDeDE,
  nbNO as pickersNbNO,
  svSE as pickersSvSE,
  frFR as pickersFrFR,
} from '@mui/x-date-pickers-pro/locales';
import {
  daDK,
  deDE,
  Localization,
  nbNO,
  svSE,
  frFR,
} from '@mui/material/locale';

import './types';
import palette from './palette';
import typography from './typography';

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
coreLocales['fr'] = frFR;

//MUI Data Grid  localizations
const dataGridLocales: Record<string, DataGridLocalization> = {};
dataGridLocales['da'] = dataGridDaDK;
dataGridLocales['de'] = dataGridDeDE;
dataGridLocales['nn'] = dataGridNbNO;
dataGridLocales['sv'] = dataGridSvSE;
dataGridLocales['fr'] = dataGridFrFR;

//MUI Date Pickers localizations
const pickersLocales: Record<string, typeof pickersDaDK> = {};
pickersLocales['da'] = pickersDaDK;
pickersLocales['de'] = pickersDeDE;
pickersLocales['nn'] = pickersNbNO;
pickersLocales['sv'] = pickersSvSE;
pickersLocales['fr'] = pickersFrFR;

export const themeWithLocale = (lang: string) => {
  return createTheme(
    theme,
    coreLocales[lang],
    dataGridLocales[lang],
    pickersLocales[lang]
  );
};

export default theme;
