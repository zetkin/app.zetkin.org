import { FC } from 'react';
import { Typography } from '@mui/material';

type TextVariant =
  | 'headingLg'
  | 'headingMd'
  | 'headingSm'
  | 'bodyMdRegular'
  | 'bodyMdBold'
  | 'bodySmRegular'
  | 'bodySmBold'
  | 'linkMd'
  | 'linkSm'
  | 'labelMdMedium'
  | 'labelMdRegular';

interface ZUITextProps {
  content: string;
  color?: 'primary' | 'secondary';
  component: 'a' | 'div' | 'p' | 'span';
  variant: TextVariant;
}

const ZUIText: FC<ZUITextProps> = ({ component, color, content, variant }) => {
  return (
    <Typography color={color} component={component} variant={variant}>
      {content}
    </Typography>
  );
};

export default ZUIText;
