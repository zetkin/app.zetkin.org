import { alpha } from '@mui/material/styles';

const palette = {
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
  divider: {
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

const chipColors = {
  aqua: {
    dark: {
      color: '#187F81',
      contrast: palette.basic.white,
    },
    light: {
      color: '#93E9EB',
      contrast: palette.basic.black,
    },
    medium: {
      color: '#28D4D7',
      contrast: palette.basic.black,
    },
  },
  blue1: {
    dark: {
      color: '#147F8F',
      contrast: palette.basic.white,
    },
    light: {
      color: '#90E9F7',
      contrast: palette.basic.black,
    },
    medium: {
      color: '#22D3EE',
      contrast: palette.basic.black,
    },
  },
  blue2: {
    dark: {
      color: '#014F77',
      contrast: palette.basic.white,
    },
    light: {
      color: '#B3DAEE',
      contrast: palette.basic.black,
    },
    medium: {
      color: '#0284C7',
      contrast: palette.basic.white,
    },
  },
  blue3: {
    dark: {
      color: '#163B8D',
      contrast: palette.basic.white,
    },
    light: {
      color: '#BED0F9',
      contrast: palette.basic.black,
    },
    medium: {
      color: '#2563EB',
      contrast: palette.basic.white,
    },
  },
  green1: {
    dark: {
      color: '#628A20',
      contrast: palette.basic.white,
    },
    light: {
      color: '#D1F39A',
      contrast: palette.basic.black,
    },
    medium: {
      color: '#A3E635',
      contrast: palette.basic.black,
    },
  },
  green2: {
    dark: {
      color: '#478837',
      contrast: palette.basic.white,
    },
    light: {
      color: '#BBF1AD',
      contrast: palette.basic.black,
    },
    medium: {
      color: '#77E25B',
      contrast: palette.basic.black,
    },
  },
  green3: {
    dark: {
      color: '#2C854D',
      contrast: palette.basic.white,
    },
    light: {
      color: '#A4EFBF',
      contrast: palette.basic.black,
    },
    medium: {
      color: '#4ADE80',
      contrast: palette.basic.black,
    },
  },
  indigo: {
    dark: {
      color: '#2F2A89',
      contrast: palette.basic.white,
    },
    light: {
      color: '#CAC7F7',
      contrast: palette.basic.black,
    },
    medium: {
      color: '#4F46E5',
      contrast: palette.basic.white,
    },
  },
  lime1: {
    dark: {
      color: '#858013',
      contrast: palette.basic.white,
    },
    light: {
      color: '#EEEA8F',
      contrast: palette.basic.black,
    },
    medium: {
      color: '#DDD520',
      contrast: palette.basic.black,
    },
  },
  lime2: {
    dark: {
      color: '#73851A',
      contrast: palette.basic.white,
    },
    light: {
      color: '#DFEF95',
      contrast: palette.basic.black,
    },
    medium: {
      color: '#',
      contrast: palette.basic.black,
    },
  },
  orange1: {
    dark: {
      color: '#88260F',
      contrast: palette.basic.white,
    },
    light: {
      color: '#F4B2A3',
      contrast: palette.basic.black,
    },
    medium: {
      color: '#E33F19',
      contrast: palette.basic.white,
    },
  },
  orange2: {
    dark: {
      color: '#8C3507',
      contrast: palette.basic.white,
    },
    light: {
      color: '#F7BC9E',
      contrast: palette.basic.black,
    },
    medium: {
      color: '#EA580C',
      contrast: palette.basic.white,
    },
  },
  orange3: {
    dark: {
      color: '#883E05',
      contrast: palette.basic.white,
    },
    light: {
      color: '#F3C39D',
      contrast: palette.basic.black,
    },
    medium: {
      color: '#E26809',
      contrast: palette.basic.white,
    },
  },
  pink: {
    dark: {
      color: '#831747',
      contrast: palette.basic.white,
    },
    light: {
      color: '#F1A9C9',
      contrast: palette.basic.black,
    },
    medium: {
      color: '#DB2777',
      contrast: palette.basic.white,
    },
  },
  purple1: {
    dark: {
      color: '#4A238E',
      contrast: palette.basic.white,
    },
    light: {
      color: '#D8C4FA',
      contrast: palette.basic.black,
    },
    medium: {
      color: '#7C3AED',
      contrast: palette.basic.white,
    },
  },
  purple2: {
    dark: {
      color: '#581F8C',
      contrast: palette.basic.white,
    },
    light: {
      color: '#DFC2F9',
      contrast: palette.basic.black,
    },
    medium: {
      color: '#9333EA',
      contrast: palette.basic.white,
    },
  },
  purple3: {
    dark: {
      color: '#661B86',
      contrast: palette.basic.white,
    },
    light: {
      color: '#E5C0F5',
      contrast: palette.basic.black,
    },
    medium: {
      color: '#AA2DDF',
      contrast: palette.basic.white,
    },
  },
  purple4: {
    dark: {
      color: '#73177F',
      contrast: palette.basic.white,
    },
    light: {
      color: '#E6A8ED',
      contrast: palette.basic.black,
    },
    medium: {
      color: '#C026D3',
      contrast: palette.basic.white,
    },
  },
  purple5: {
    dark: {
      color: '#7C1763',
      contrast: palette.basic.white,
    },
    light: {
      color: '#EBA9DB',
      contrast: palette.basic.black,
    },
    medium: {
      color: '#CE27A5',
      contrast: palette.basic.white,
    },
  },
  red1: {
    dark: {
      color: '#841717',
      contrast: palette.basic.white,
    },
    light: {
      color: '#F1A8A8',
      contrast: palette.basic.black,
    },
    medium: {
      color: '#DC2626',
      contrast: palette.basic.white,
    },
  },
  red2: {
    dark: {
      color: '#87112B',
      contrast: palette.basic.white,
    },
    light: {
      color: '#F3A5B6',
      contrast: palette.basic.black,
    },
    medium: {
      color: '#E11D48',
      contrast: palette.basic.white,
    },
  },
  turquoise1: {
    dark: {
      color: '#1F7F5C',
      contrast: palette.basic.white,
    },
    light: {
      color: '#99E9CC',
      contrast: palette.basic.black,
    },
    medium: {
      color: '#34D399',
      contrast: palette.basic.black,
    },
  },
  turquoise2: {
    dark: {
      color: '#1B7F73',
      contrast: palette.basic.white,
    },
    light: {
      color: '#96E9DF',
      contrast: palette.basic.black,
    },
    medium: {
      color: '#2DD4BF',
      contrast: palette.basic.black,
    },
  },
  yellow1: {
    dark: {
      color: '#97651D',
      contrast: palette.basic.white,
    },
    light: {
      color: '#FDD497',
      contrast: palette.basic.black,
    },
    medium: {
      color: '#FBA930',
      contrast: palette.basic.black,
    },
  },
  yellow2: {
    dark: {
      color: '#977316',
      contrast: palette.basic.white,
    },
    light: {
      color: '#FDDF91',
      contrast: palette.basic.black,
    },
    medium: {
      color: '#FBBF24',
      contrast: palette.basic.black,
    },
  },
  yellow3: {
    dark: {
      color: '#967A0D',
      contrast: palette.basic.white,
    },
    light: {
      color: '#FDE58A',
      contrast: palette.basic.black,
    },
    medium: {
      color: '#FACC15',
      contrast: palette.basic.black,
    },
  },
} as const;

export const themePalette = {
  activityStatusColors: {
    cancelled: palette.grey[500],
    closed: palette.grey[200],
    draft: palette.yellow[400],
    ended: palette.grey[200],
    published: palette.green[600],
    scheduled: palette.blue[600],
  },
  background: {
    default: palette.grey[25],
    paper: palette.basic.white,
  },
  chipColors: chipColors,
  common: {
    black: palette.grey[950],
    white: palette.basic.white,
  },
  data: {
    [100]: palette.purple[100],
    [300]: palette.purple[300],
    [500]: palette.purple[500],
    [700]: palette.purple[700],
    [900]: palette.purple[900],
  },
  divider: palette.divider.main,
  dividerLighter: palette.divider.lighter,
  error: {
    contrastText: palette.basic.white,
    dark: palette.red[800],
    light: palette.red[400],
    main: palette.red[600],
  },
  filterCategoryColors: {
    darkBlue: { pale: chipColors.blue3.light, strong: chipColors.blue3.medium },
    green: { pale: chipColors.green1.light, strong: chipColors.green1.medium },
    lightBlue: { pale: chipColors.aqua.light, strong: chipColors.aqua.medium },
    orange: {
      pale: chipColors.yellow1.light,
      strong: chipColors.yellow1.medium,
    },
    pink: { pale: chipColors.pink.light, strong: chipColors.pink.medium },
    purple: {
      pale: chipColors.purple3.light,
      strong: chipColors.purple3.medium,
    },
    red: { pale: chipColors.red1.light, strong: chipColors.red1.medium },
    teal: {
      pale: chipColors.turquoise1.light,
      strong: chipColors.turquoise1.medium,
    },
    yellow: {
      pale: chipColors.yellow3.light,
      strong: chipColors.yellow3.medium,
    },
  },
  info: {
    contrastText: palette.basic.white,
    dark: palette.blue[800],
    light: palette.blue[400],
    main: palette.blue[600],
  },
  //TO-DO remove property and implement similar colors from our palette
  onSurface: {
    disabled: '#231F2061',
    high: '#231F20DE',
    medium: '#231F2099',
  },
  //TO-DO remove property and implement similar colors from our palette
  outline: {
    main: alpha(palette.basic.black, 0.12),
  },
  palette: palette,
  primary: {
    contrastText: palette.basic.white,
    dark: palette.basic.black,
    focus: alpha(palette.grey[950], 0.12),
    focusVisible: alpha(palette.grey[950], 0.3),
    hover: alpha(palette.grey[950], 0.04),
    light: palette.grey[600],
    main: palette.grey[950],
    outlinedBorder: alpha(palette.grey[950], 0.5),
    selected: alpha(palette.grey[950], 0.08),
  },
  secondary: {
    light: palette.grey[400],
    main: palette.grey[500],
  },
  //TO-DO remove property and implement similar colors from our palette
  statusColors: {
    blue: 'rgba(25, 118, 210, 1)',
    gray: alpha(palette.basic.black, 0.12),
    green: 'rgba(102, 187, 106, 1)',
    orange: 'rgba(245, 124, 0, 1)',
    red: 'rgba(239, 83, 80, 1)',
  },
  success: {
    contrastText: palette.basic.white,
    dark: palette.green[800],
    light: palette.green[400],
    main: palette.green[600],
  },
  text: {
    disabled: palette.grey[400],
    primary: palette.grey[950],
    secondary: palette.grey[500],
  },
  //TO-DO remove property and implement similar colors from our palette
  transparentGrey: {
    light: alpha(palette.basic.black, 0.04),
  },
  //TO-DO remove property and implement similar colors from our palette
  viewColumnGallery: {
    blue: '#1976D2',
    purple: '#BA68C8',
    red: '#ED1C55',
  },
  warning: {
    contrastText: palette.basic.white,
    dark: palette.yellow[600],
    light: palette.yellow[200],
    main: palette.yellow[400],
  },
} as const;
