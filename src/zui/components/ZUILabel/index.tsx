import { FC, ReactNode } from 'react';
import { BoxProps, Typography } from '@mui/material';

import { ZUIPrimary, ZUISecondary } from '../types';

type ZUILabelProps = {
  /**
   * The content to be rendered as a label.
   */
  children: ReactNode;

  /**
   * The color of the text content.
   *
   * Defaults to "primary".
   */
  color?: ZUIPrimary | ZUISecondary;

  /**
   * The element the label is rendered as.
   *
   * Defaults to "p".
   */
  component?: 'div' | 'p' | 'span';

  /**
   * If true, the text gets a bottom margin.
   *
   * Defaults to "false".
   */
  gutterBottom?: boolean;

  /**
   *	If true, the text will not wrap,
   *  but instead will truncate with a text overflow ellipsis.
   *  Note that text overflow can only happen with
   *  block or inline-block level elements
   * (the element needs to have a width in order to overflow).
   */
  noWrap?: boolean;

  /**
   * The variant of text to use as the label.
   *
   * Defaults to "labelMdRegular".
   */
  variant?: 'labelMdMedium' | 'labelMdRegular';
} & Omit<
  BoxProps,
  | 'sx'
  | 'color'
  | 'typography'
  | 'fontFamily'
  | 'fontSize'
  | 'fontStyle'
  | 'fontWeight'
  | 'letterSpacing'
  | 'lineHeight'
  | 'textAlign'
  | 'textTransform'
>;

const ZUILabel: FC<ZUILabelProps> = ({
  children,
  color = 'primary',
  component = 'p',
  gutterBottom = false,
  noWrap,
  variant = 'labelMdRegular',
  ...boxProps
}) => (
  <Typography
    {...boxProps}
    component={component}
    gutterBottom={gutterBottom}
    noWrap={noWrap}
    sx={(theme) => ({
      color:
        color == 'primary'
          ? theme.palette.text.primary
          : theme.palette.text.secondary,
    })}
    variant={variant}
  >
    {children}
  </Typography>
);

export default ZUILabel;
