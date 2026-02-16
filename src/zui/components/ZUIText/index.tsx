import { FC, ReactNode } from 'react';
import { BoxProps, Typography } from '@mui/material';

import { ZUIPrimary, ZUISecondary } from '../types';

type TextVariant =
  | 'bodyMdRegular'
  | 'bodyMdSemiBold'
  | 'bodySmRegular'
  | 'bodySmSemiBold'
  | 'headingLg'
  | 'headingMd'
  | 'headingSm';

type ZUITextProps = {
  children: ReactNode;
  color?: ZUIPrimary | ZUISecondary | 'inherit';
  component?: 'div' | 'p' | 'span';
  gutterBottom?: boolean;
  noWrap?: boolean;
  renderLineBreaks?: boolean;
  variant?: TextVariant;
} & Omit<
  BoxProps,
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

const ZUIText: FC<ZUITextProps> = ({
  children,
  color = 'primary',
  component = 'p',
  gutterBottom,
  noWrap,
  renderLineBreaks,
  variant = 'bodyMdRegular',
  ...boxProps
}) => (
  <Typography
    {...boxProps}
    color={color == 'inherit' ? '' : color}
    component={component}
    gutterBottom={gutterBottom}
    noWrap={noWrap}
    variant={variant}
    whiteSpace={renderLineBreaks ? 'pre-line' : undefined}
  >
    {children}
  </Typography>
);

export default ZUIText;
