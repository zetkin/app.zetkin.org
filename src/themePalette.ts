const palette = {
  basic: {
    black: '000000',
    white: 'FFFFFF',
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
    [100]: '#C189EF',
    [200]: '#AE66EA',
    [300]: '#9D46E6',
    [400]: '#7800DC',
    [50]: '#E4CCF8',
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
} as const;

export const themePalette = {
  chipColors: chipColors,
  palette: palette,
  primary: {
    dark: palette.basic.black,
    light: palette.grey[600],
    main: palette.grey[950],
  },
} as const;
