import { Link } from '@mui/material';
import { makeStyles } from '@mui/styles';
import NextLink from 'next/link';
import { FC } from 'react';

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
  size?: 'sm' | 'md';
};

const ZUILink: FC<ZUILinkProps> = ({
  href,
  message,
  openInNewTab = false,
  size = 'sm',
}) => {
  const classes = useStyles();

  return (
    <Link
      className={classes.link}
      component={NextLink}
      href={href}
      rel={openInNewTab ? 'noopener' : ''}
      target={openInNewTab ? '_blank' : ''}
      variant={size == 'sm' ? 'linkSm' : 'linkMd'}
    >
      {message}
    </Link>
  );
};

export default ZUILink;
