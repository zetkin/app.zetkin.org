import { Link } from '@mui/material';
import NextLink from 'next/link';
import { FC } from 'react';

import { ZUIMedium, ZUISmall } from '../types';

type ZUILinkProps = {
  /**
   * The href to link to.
   */
  href: string;

  /**
   * Gets the color for the link text from the font color of the parent
   */
  inheritColor?: boolean;

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
};

const ZUILink: FC<ZUILinkProps> = ({
  href,
  inheritColor = false,
  text,
  openInNewTab = false,
  size,
}) => {
  const linkVariants = {
    medium: 'linkMd',
    small: 'linkSm',
  } as const;

  return (
    <Link
      component={NextLink}
      href={href}
      rel={openInNewTab ? 'noopener' : ''}
      sx={(theme) => ({
        '&:hover': {
          textDecorationColor: inheritColor
            ? 'inherit'
            : theme.palette.text.primary,
        },
        color: inheritColor ? 'inherit' : theme.palette.text.primary,
        textDecorationColor: inheritColor
          ? 'inherit'
          : theme.palette.text.primary,
      })}
      target={openInNewTab ? '_blank' : ''}
      variant={size ? linkVariants[size] : undefined}
    >
      {text}
    </Link>
  );
};

export default ZUILink;
