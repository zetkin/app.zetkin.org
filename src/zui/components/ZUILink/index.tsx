import { Link } from '@mui/material';
import NextLink from 'next/link';
import { FC } from 'react';

import { ZUISize } from '../types';

type ZUILinkProps = {
  /**
   * The href to link to.
   */
  href: string;

  /**
   * If true, the link will open in a new tab.
   *
   * Defaults to "false".
   */
  openInNewTab?: boolean;

  /**
   * The size of the text.
   *
   * Defaults to "small".
   */
  size?: ZUISize;

  /**
   * The text that will show as the link.
   */
  text: string;
};

const ZUILink: FC<ZUILinkProps> = ({
  href,
  text,
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
    {text}
  </Link>
);

export default ZUILink;
