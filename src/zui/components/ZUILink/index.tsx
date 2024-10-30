import { Link } from '@mui/material';
import { makeStyles } from '@mui/styles';
import NextLink from 'next/link';
import { FC } from 'react';

import { ZUISize } from '../types';

const useStyles = makeStyles((theme) => ({
  link: {
    '&:hover': {
      textDecorationColor: 'primary',
    },
    textDecorationColor: theme.palette.text.primary,
  },
}));

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
}) => {
  const classes = useStyles();

  return (
    <Link
      className={classes.link}
      component={NextLink}
      href={href}
      rel={openInNewTab ? 'noopener' : ''}
      target={openInNewTab ? '_blank' : ''}
      variant={size == 'small' ? 'linkSm' : 'linkMd'}
    >
      {message}
    </Link>
  );
};

export default ZUILink;
