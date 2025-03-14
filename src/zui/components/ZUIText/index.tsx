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
  color?: ZUIPrimary | ZUISecondary;
  component?: 'div' | 'p' | 'span';
  gutterBottom?: boolean;
  noWrap?: boolean;
  variant?: TextVariant;
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

const ZUIText: FC<ZUITextProps> = ({
  children,
  color,
  component = 'p',
  gutterBottom,
  noWrap,
  variant = 'bodySmRegular',
  ...boxProps
}) => {
  return (
    <Typography
      {...boxProps}
      color={color}
      component={component}
      gutterBottom={gutterBottom}
      noWrap={noWrap}
      variant={variant}
    >
      {children}
    </Typography>
  );
};

export default ZUIText;
