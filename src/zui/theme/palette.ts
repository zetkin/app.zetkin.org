import { alpha, Palette } from '@mui/material';

const uiSwatches = {
  basic: {
    black: '#000000',
    white: '#FFFFFF',
  },
  blue: {
    [100]: '#DFEBFA',
    [200]: '#C7DCF6',
    [300]: '#A0C6F0',
    [400]: '#73A7E7',
    [50]: '#F1F6FD',
    [500]: '#5388DE',
    [600]: '#3E6CD2',
    [700]: '#3559C0',
    [800]: '#304A9D',
    [900]: '#2C417C',
    [950]: '#1F294C',
  },
  dividers: {
    lighter: '#F0F0F0',
    main: '#E0E0E0',
  },
  green: {
    [100]: '#DDFBE7',
    [200]: '#BDF5D1',
    [300]: '#8AEBAD',
    [400]: '#4FD981',
    [50]: '#F0FDF4',
    [500]: '#28BF60',
    [600]: '#1B9E4B',
    [700]: '#197C3E',
    [800]: '#196235',
    [900]: '#16512D',
    [950]: '#062D16',
  },
  grey: {
    [100]: '#E7E7E7',
    [200]: '#D1D1D1',
    [25]: '#FBFBFB',
    [300]: '#B0B0B0',
    [400]: '#888888',
    [50]: '#F6F6F6',
    [500]: '#6D6D6D',
    [600]: '#5D5D5D',
    [700]: '#4F4F4F',
    [800]: '#454545',
    [900]: '#3D3D3D',
    [950]: '#252525',
  },
  purple: {
    [100]: '#E4CCF8',
    [300]: '#C189EF',
    [500]: '#AE66EA',
    [700]: '#9D46E6',
    [900]: '#7800DC',
  },
  red: {
    [100]: '#FCE4E4',
    [200]: '#FACECE',
    [300]: '#F5ACAC',
    [400]: '#EE7B7B',
    [50]: '#FDF3F3',
    [500]: '#E25151',
    [600]: '#CE3434',
    [700]: '#AD2828',
    [800]: '#8F2525',
    [900]: '#772525',
    [950]: '#400F0F',
  },
  yellow: {
    [100]: '#FCF8C5',
    [200]: '#FAED8E',
    [300]: '#F7DC4D',
    [400]: '#F3C81C',
    [50]: '#FDFBE9',
    [500]: '#E3AF0F',
    [600]: '#C4880A',
    [700]: '#9C610C',
    [800]: '#814D12',
    [900]: '#6E3F15',
    [950]: '#402008',
  },
} as const;

export const funSwatches = {
  aqua: {
    dark: {
      color: '#187F81',
      contrast: uiSwatches.basic.white,
    },
    light: {
      color: '#93E9EB',
      contrast: uiSwatches.basic.black,
    },
    medium: {
      color: '#28D4D7',
      contrast: uiSwatches.basic.black,
    },
  },
  blue1: {
    dark: {
      color: '#147F8F',
      contrast: uiSwatches.basic.white,
    },
    light: {
      color: '#90E9F7',
      contrast: uiSwatches.basic.black,
    },
    medium: {
      color: '#22D3EE',
      contrast: uiSwatches.basic.black,
    },
  },
  blue2: {
    dark: {
      color: '#014F77',
      contrast: uiSwatches.basic.white,
    },
    light: {
      color: '#B3DAEE',
      contrast: uiSwatches.basic.black,
    },
    medium: {
      color: '#0284C7',
      contrast: uiSwatches.basic.white,
    },
  },
  blue3: {
    dark: {
      color: '#163B8D',
      contrast: uiSwatches.basic.white,
    },
    light: {
      color: '#BED0F9',
      contrast: uiSwatches.basic.black,
    },
    medium: {
      color: '#2563EB',
      contrast: uiSwatches.basic.white,
    },
  },
  green1: {
    dark: {
      color: '#628A20',
      contrast: uiSwatches.basic.white,
    },
    light: {
      color: '#D1F39A',
      contrast: uiSwatches.basic.black,
    },
    medium: {
      color: '#A3E635',
      contrast: uiSwatches.basic.black,
    },
  },
  green2: {
    dark: {
      color: '#478837',
      contrast: uiSwatches.basic.white,
    },
    light: {
      color: '#BBF1AD',
      contrast: uiSwatches.basic.black,
    },
    medium: {
      color: '#77E25B',
      contrast: uiSwatches.basic.black,
    },
  },
  green3: {
    dark: {
      color: '#2C854D',
      contrast: uiSwatches.basic.white,
    },
    light: {
      color: '#A4EFBF',
      contrast: uiSwatches.basic.black,
    },
    medium: {
      color: '#4ADE80',
      contrast: uiSwatches.basic.black,
    },
  },
  indigo: {
    dark: {
      color: '#2F2A89',
      contrast: uiSwatches.basic.white,
    },
    light: {
      color: '#CAC7F7',
      contrast: uiSwatches.basic.black,
    },
    medium: {
      color: '#4F46E5',
      contrast: uiSwatches.basic.white,
    },
  },
  lime1: {
    dark: {
      color: '#858013',
      contrast: uiSwatches.basic.white,
    },
    light: {
      color: '#EEEA8F',
      contrast: uiSwatches.basic.black,
    },
    medium: {
      color: '#DDD520',
      contrast: uiSwatches.basic.black,
    },
  },
  lime2: {
    dark: {
      color: '#73851A',
      contrast: uiSwatches.basic.white,
    },
    light: {
      color: '#DFEF95',
      contrast: uiSwatches.basic.black,
    },
    medium: {
      color: '#C0DE2B',
      contrast: uiSwatches.basic.black,
    },
  },
  orange1: {
    dark: {
      color: '#88260F',
      contrast: uiSwatches.basic.white,
    },
    light: {
      color: '#F4B2A3',
      contrast: uiSwatches.basic.black,
    },
    medium: {
      color: '#E33F19',
      contrast: uiSwatches.basic.white,
    },
  },
  orange2: {
    dark: {
      color: '#8C3507',
      contrast: uiSwatches.basic.white,
    },
    light: {
      color: '#F7BC9E',
      contrast: uiSwatches.basic.black,
    },
    medium: {
      color: '#EA580C',
      contrast: uiSwatches.basic.white,
    },
  },
  orange3: {
    dark: {
      color: '#883E05',
      contrast: uiSwatches.basic.white,
    },
    light: {
      color: '#F3C39D',
      contrast: uiSwatches.basic.black,
    },
    medium: {
      color: '#E26809',
      contrast: uiSwatches.basic.white,
    },
  },
  pink: {
    dark: {
      color: '#831747',
      contrast: uiSwatches.basic.white,
    },
    light: {
      color: '#F1A9C9',
      contrast: uiSwatches.basic.black,
    },
    medium: {
      color: '#DB2777',
      contrast: uiSwatches.basic.white,
    },
  },
  purple1: {
    dark: {
      color: '#4A238E',
      contrast: uiSwatches.basic.white,
    },
    light: {
      color: '#D8C4FA',
      contrast: uiSwatches.basic.black,
    },
    medium: {
      color: '#7C3AED',
      contrast: uiSwatches.basic.white,
    },
  },
  purple2: {
    dark: {
      color: '#581F8C',
      contrast: uiSwatches.basic.white,
    },
    light: {
      color: '#DFC2F9',
      contrast: uiSwatches.basic.black,
    },
    medium: {
      color: '#9333EA',
      contrast: uiSwatches.basic.white,
    },
  },
  purple3: {
    dark: {
      color: '#661B86',
      contrast: uiSwatches.basic.white,
    },
    light: {
      color: '#E5C0F5',
      contrast: uiSwatches.basic.black,
    },
    medium: {
      color: '#AA2DDF',
      contrast: uiSwatches.basic.white,
    },
  },
  purple4: {
    dark: {
      color: '#73177F',
      contrast: uiSwatches.basic.white,
    },
    light: {
      color: '#E6A8ED',
      contrast: uiSwatches.basic.black,
    },
    medium: {
      color: '#C026D3',
      contrast: uiSwatches.basic.white,
    },
  },
  purple5: {
    dark: {
      color: '#7C1763',
      contrast: uiSwatches.basic.white,
    },
    light: {
      color: '#EBA9DB',
      contrast: uiSwatches.basic.black,
    },
    medium: {
      color: '#CE27A5',
      contrast: uiSwatches.basic.white,
    },
  },
  red1: {
    dark: {
      color: '#841717',
      contrast: uiSwatches.basic.white,
    },
    light: {
      color: '#F1A8A8',
      contrast: uiSwatches.basic.black,
    },
    medium: {
      color: '#DC2626',
      contrast: uiSwatches.basic.white,
    },
  },
  red2: {
    dark: {
      color: '#87112B',
      contrast: uiSwatches.basic.white,
    },
    light: {
      color: '#F3A5B6',
      contrast: uiSwatches.basic.black,
    },
    medium: {
      color: '#E11D48',
      contrast: uiSwatches.basic.white,
    },
  },
  turquoise1: {
    dark: {
      color: '#1F7F5C',
      contrast: uiSwatches.basic.white,
    },
    light: {
      color: '#99E9CC',
      contrast: uiSwatches.basic.black,
    },
    medium: {
      color: '#34D399',
      contrast: uiSwatches.basic.black,
    },
  },
  turquoise2: {
    dark: {
      color: '#1B7F73',
      contrast: uiSwatches.basic.white,
    },
    light: {
      color: '#96E9DF',
      contrast: uiSwatches.basic.black,
    },
    medium: {
      color: '#2DD4BF',
      contrast: uiSwatches.basic.black,
    },
  },
  yellow1: {
    dark: {
      color: '#97651D',
      contrast: uiSwatches.basic.white,
    },
    light: {
      color: '#FDD497',
      contrast: uiSwatches.basic.black,
    },
    medium: {
      color: '#FBA930',
      contrast: uiSwatches.basic.black,
    },
  },
  yellow2: {
    dark: {
      color: '#977316',
      contrast: uiSwatches.basic.white,
    },
    light: {
      color: '#FDDF91',
      contrast: uiSwatches.basic.black,
    },
    medium: {
      color: '#FBBF24',
      contrast: uiSwatches.basic.black,
    },
  },
  yellow3: {
    dark: {
      color: '#967A0D',
      contrast: uiSwatches.basic.white,
    },
    light: {
      color: '#FDE58A',
      contrast: uiSwatches.basic.black,
    },
    medium: {
      color: '#FACC15',
      contrast: uiSwatches.basic.black,
    },
  },
} as const;

const swatches = {
  ...uiSwatches,
  ...funSwatches,
} as const;

export type Swatches = typeof swatches;

const palette: Omit<
  Palette,
  | 'action'
  | 'augmentColor'
  | 'divider'
  | 'mode'
  | 'contrastThreshold'
  | 'tonalOffset'
  | 'getContrastText'
> = {
  activityStatusColors: {
    cancelled: uiSwatches.grey[500],
    closed: uiSwatches.grey[200],
    draft: uiSwatches.yellow[400],
    ended: uiSwatches.grey[200],
    published: uiSwatches.green[600],
    scheduled: uiSwatches.blue[600],
  },
  background: {
    default: uiSwatches.grey[25],
    paper: uiSwatches.basic.white,
  },
  common: {
    black: uiSwatches.grey[950],
    white: uiSwatches.basic.white,
  },
  data: {
    final: uiSwatches.purple[100],
    main: uiSwatches.purple[900],
    mid1: uiSwatches.purple[300],
    mid2: uiSwatches.purple[500],
    mid3: uiSwatches.purple[700],
  },
  dividers: {
    lighter: uiSwatches.dividers.lighter,
    main: uiSwatches.dividers.main,
  },
  error: {
    contrastText: uiSwatches.basic.white,
    dark: uiSwatches.red[800],
    light: uiSwatches.red[400],
    main: uiSwatches.red[600],
  },
  //Remove A.. properties from type?
  grey: { ...uiSwatches.grey, A100: '', A200: '', A400: '', A700: '' },
  info: {
    contrastText: uiSwatches.basic.white,
    dark: uiSwatches.blue[800],
    light: uiSwatches.blue[400],
    main: uiSwatches.blue[600],
  },
  primary: {
    contrastText: uiSwatches.basic.white,
    dark: '', // TODO: Remove from type?
    focus: alpha(uiSwatches.grey[950], 0.12),
    focusVisible: alpha(uiSwatches.grey[950], 0.3),
    hover: alpha(uiSwatches.grey[950], 0.04),
    light: '', // TODO: Remove from type?
    main: uiSwatches.grey[950],
    outlinedBorder: alpha(uiSwatches.grey[950], 0.5),
    selected: alpha(uiSwatches.grey[950], 0.08),
  },
  secondary: {
    contrastText: '', // Remove from type?
    dark: '', // Remove from type?
    light: uiSwatches.grey[400],
    main: uiSwatches.grey[500],
  },
  success: {
    contrastText: uiSwatches.basic.white,
    dark: uiSwatches.green[800],
    light: uiSwatches.green[400],
    main: uiSwatches.green[600],
  },
  swatches: swatches,
  text: {
    disabled: uiSwatches.grey[400],
    primary: uiSwatches.grey[950],
    secondary: uiSwatches.grey[500],
  },
  warning: {
    contrastText: uiSwatches.basic.black,
    dark: uiSwatches.yellow[600],
    light: uiSwatches.yellow[200],
    main: uiSwatches.yellow[400],
  },
};

export default palette;
