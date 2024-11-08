import { Typography } from '@mui/material/styles/createTypography';
import { Palette } from '@mui/material';
import { CSSProperties } from 'react';

import { Swatches } from './palette';

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    bodyMdRegular: true;
    bodyMdSemiBold: true;
    bodySmRegular: true;
    bodySmSemiBold: true;
    headingLg: true;
    headingMd: true;
    headingSm: true;
    labelMdMedium: true;
    labelMdRegular: true;
    linkMd: true;
    linkSm: true;
    labelXlMedium: true;
    labelLgSemiBold: true;
    labelLgMedium: true;
    labelMdSemiBold: true;
    labelSmSemiBold: true;
    labelSmMedium: true;
    h1: false;
    h3: false;
    h2: false;
    h4: false;
    h5: false;
    h6: false;
    subtitle1: false;
    subtitle2: false;
    body1: false;
    body2: false;
    caption: false;
    button: false;
    overline: false;
  }
}

interface Elevation {
  bottom: {
    big: {
      light: string;
      medium: string;
    };
    small: {
      light: string;
      medium: string;
    };
  };
  top: {
    big: {
      light: string;
      medium: string;
    };
    small: {
      light: string;
      medium: string;
    };
  };
}

declare module '@mui/material/styles' {
  interface Theme {
    elevation: Elevation;
    palette: Palette;
    typography: Typography;
  }

  interface ThemeOptions {
    elevation?: Elevation;
  }

  /**
   * Defines the type of typography variants in ZUI.
   */
  interface TypographyVariants {
    bodyMdRegular: CSSProperties;
    bodyMdSemiBold: CSSProperties;
    bodySmRegular: CSSProperties;
    bodySmSemiBold: CSSProperties;
    headingLg: CSSProperties;
    headingMd: CSSProperties;
    headingSm: CSSProperties;
    labelMdMedium: CSSProperties;
    labelMdRegular: CSSProperties;
    linkMd: CSSProperties;
    linkSm: CSSProperties;
    labelXlMedium: CSSProperties;
    labelLgSemiBold: CSSProperties;
    labelLgMedium: CSSProperties;
    labelMdSemiBold: CSSProperties;
    labelSmSemiBold: CSSProperties;
    labelSmMedium: CSSProperties;
  }

  /**
   * Defines the options that can be passed to createTypography(),
   * limited only to the variants in the ZUI system.
   */
  interface TypographyVariantsOptions extends Partial<TypographyVariants> {}
}

interface DataColor {
  final: string;
  main: string;
  mid1: string;
  mid2: string;
  mid3: string;
}

declare module '@mui/material/styles/createPalette' {
  interface PaletteColor {
    focus?: string;
    focusVisible?: string;
    hover?: string;
    outlinedBorder?: string;
    selected?: string;
  }

  interface Palette {
    activityStatusColors: {
      cancelled: string;
      closed: string;
      draft: string;
      ended: string;
      published: string;
      scheduled: string;
    };
    data: DataColor;
    dividers: {
      lighter: string;
      main: string;
    };
    swatches: Swatches;
  }

  interface PaletteOptions extends Partial<Palette> {}

  interface SimplePaletteColorOptions {
    focus?: string;
    focusVisible?: string;
    hover?: string;
    outlinedBorder?: string;
    selected?: string;
  }
}
