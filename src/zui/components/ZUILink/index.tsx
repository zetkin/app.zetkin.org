import { Link } from '@mui/material';
import NextLink from 'next/link';
import { FC } from 'react';

import { ZUIMedium, ZUISmall } from '../types';

type ZUILinkProps = {
  /**
   * If true, only show underline when hovering
   */
  hoverUnderline?: boolean;

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
   * If nothing is sent in it inherits the style from its parent.
   */
  size?: ZUISmall | ZUIMedium;

  /**
   * The text that will show as the link.
   */
  text: string;

  /**
   * Switch color (default: primary)
   */
  variant?: 'primary' | 'secondary';
};

const ZUILink: FC<ZUILinkProps> = ({
  href,
  text,
  openInNewTab = false,
  size,
  variant = 'primary',
  hoverUnderline,
}) => {
  const linkVariants = {
    medium: 'linkMd',
    small: 'linkSm',
  } as const;

  return (
    <Link
      component={NextLink}
      href={href}
      rel={openInNewTab ? 'noopener noreferrer nofollow' : ''}
      sx={(theme) => ({
        '&:hover': {
          textDecoration: 'underline',
          textDecorationColor: theme.palette.text[variant],
        },
        color: theme.palette.text[variant],
        textDecoration: hoverUnderline ? 'none' : 'underline',
        textDecorationColor: theme.palette.text[variant],
      })}
      target={openInNewTab ? '_blank' : ''}
      variant={size ? linkVariants[size] : undefined}
    >
      {text}
    </Link>
  );
};

export default ZUILink;
