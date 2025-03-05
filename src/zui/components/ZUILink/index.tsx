import { Link } from '@mui/material';
import NextLink from 'next/link';
import { FC } from 'react';

import { ZUISize } from '../types';
type ZUILinkProps = {
  href: string;
  message: string;
  openInNewTab?: boolean;
  size?: ZUISize;
};

const ZUILink: FC<ZUILinkProps> = ({
  href,
  message,
  openInNewTab = false,
  size = 'small',
}) => (
  <Link
    component={NextLink}
    href={href}
    rel={openInNewTab ? 'noopener' : ''}
    sx={(theme) => ({
      '&:hover': {
        textDecorationColor: theme.palette.text.primary,
      },
      textDecorationColor: theme.palette.text.primary,
    })}
    target={openInNewTab ? '_blank' : ''}
    variant={size == 'small' ? 'linkSm' : 'linkMd'}
  >
    {message}
  </Link>
);

export default ZUILink;
