import { TypographyVariants as MUITypographyVariants } from '@mui/material/styles';
import { Palette as MUIPalette } from '@mui/material';
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
    h1: true;
    h3: true;
    h2: true;
    h4: true;
    h5: true;
    h6: true;
    subtitle1: true;
    subtitle2: true;
    body1: true;
    body2: true;
    caption: true;
    button: true;
    overline: true;
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
    palette: MUIPalette;
    typography: MUITypographyVariants;
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
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TypographyVariantsOptions extends Partial<TypographyVariants> {}
}

interface DataColor {
  final: string;
  main: string;
  mid1: string;
  mid2: string;
  mid3: string;
}

declare module '@mui/material/styles' {
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
    //TODO: Remove from type once the use of these colors have been replaced everywhere
    filterCategoryColors: {
      darkBlue: {
        pale: string;
        strong: string;
      };
      green: {
        pale: string;
        strong: string;
      };
      lightBlue: {
        pale: string;
        strong: string;
      };
      orange: {
        pale: string;
        strong: string;
      };
      pink: { pale: string; strong: string };
      purple: {
        pale: string;
        strong: string;
      };
      red: { pale: string; strong: string };
      teal: {
        pale: string;
        strong: string;
      };
      yellow: {
        pale: string;
        strong: string;
      };
    };
    //TODO: Remove from type once the use of these colors have been replaced everywhere
    onSurface: {
      disabled: string;
      high: string;
      medium: string;
    };
    //TODO: Remove from type once the use of these colors have been replaced everywhere
    outline: {
      main: string;
    };
    //TODO: Remove from type once the use of these colors have been replaced everywhere
    statusColors: {
      blue: string;
      green: string;
      grey: string;
      orange: string;
      red: string;
    };
    //TODO: Remove from type once the use of these colors have been replaced everywhere
    transparentGrey: { light: string };
    //TODO: Remove from type once the use of these colors have been replaced everywhere
    viewColumnGallery: {
      blue: string;
      purple: string;
      red: string;
    };
    swatches: Swatches;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface PaletteOptions extends Partial<Palette> {}

  interface SimplePaletteColorOptions {
    focus?: string;
    focusVisible?: string;
    hover?: string;
    outlinedBorder?: string;
    selected?: string;
  }
}
