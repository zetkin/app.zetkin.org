import { CSSProperties, FC, ReactNode } from 'react';
import { Figtree } from 'next/font/google';
import { BoxProps, Typography } from '@mui/material';

//Font family
const figtree = Figtree({ subsets: ['latin-ext'] });

export const textVariants: Record<string, CSSProperties> = {
  bodyMdRegular: {
    fontFamily: figtree.style.fontFamily,
    fontSize: '1rem',
    fontWeight: 300,
    letterSpacing: '0.01rem',
    lineHeight: '1.5rem',
  },
  bodyMdSemiBold: {
    fontFamily: figtree.style.fontFamily,
    fontSize: '1rem',
    fontWeight: 500,
    letterSpacing: '0.01rem',
    lineHeight: '1.5rem',
  },
  bodySmRegular: {
    fontFamily: figtree.style.fontFamily,
    fontSize: '0.875rem',
    fontWeight: 300,
    letterSpacing: '0.01rem',
    lineHeight: '1.313rem',
  },
  bodySmSemiBold: {
    fontFamily: figtree.style.fontFamily,
    fontSize: '0.875rem',
    fontWeight: 500,
    letterSpacing: '0.01rem',
    lineHeight: '1.313rem',
  },
  headingLg: {
    fontFamily: figtree.style.fontFamily,
    fontSize: '1.375rem',
    fontWeight: 400,
    letterSpacing: '-0.005rem',
    lineHeight: '1.788rem',
  },
  headingMd: {
    fontFamily: figtree.style.fontFamily,
    fontSize: '1.125rem',
    fontWeight: 400,
    letterSpacing: '-0.005rem',
    lineHeight: '1.463rem',
  },
  headingSm: {
    fontFamily: figtree.style.fontFamily,
    fontSize: '1rem',
    fontWeight: 400,
    letterSpacing: '-0.005rem',
    lineHeight: '1.3rem',
  },

  labelMdMedium: {
    fontFamily: figtree.style.fontFamily,
    fontSize: '0.875rem',
    fontWeight: 400,
    letterSpacing: '0.03rem',
    lineHeight: '1.313rem',
  },
  labelMdRegular: {
    fontFamily: figtree.style.fontFamily,
    fontSize: '0.875rem',
    fontWeight: 300,
    letterSpacing: '0.03rem',
    lineHeight: '1.313rem',
  },
  linkMd: {
    fontFamily: figtree.style.fontFamily,
    fontSize: '1rem',
    fontWeight: 300,
    lineHeight: '1.5rem',
  },
  linkSm: {
    fontFamily: figtree.style.fontFamily,
    fontSize: '0.875rem',
    fontWeight: 300,
    lineHeight: '1.313rem',
  },
} as const;

type ZUITextProps = {
  children: ReactNode;
  color?: 'primary' | 'secondary';
  component?: 'div' | 'p' | 'span';
  gutterBottom?: boolean;
  noWrap?: boolean;
  variant?: keyof typeof textVariants;
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
      sx={textVariants[variant]}
    >
      {children}
    </Typography>
  );
};

export default ZUIText;
