import { FC, ReactNode } from 'react';
import { BoxProps, Typography } from '@mui/material';

type ZUILabelProps = {
  children: ReactNode;
  color?: 'primary' | 'secondary';
  component?: 'div' | 'p' | 'span';
  gutterBottom?: boolean;
  noWrap?: boolean;
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
  color,
  component = 'p',
  gutterBottom,
  noWrap,
  variant = 'labelMdRegular',
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

export default ZUILabel;
