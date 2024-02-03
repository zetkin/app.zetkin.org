import { makeStyles } from '@mui/styles';
import { Typography } from '@mui/material';
import { FC, ReactNode } from 'react';

const useStyles = makeStyles((theme) => ({
  text: {
    display: 'inline',
    textDecoration: 'underline',
    textDecorationColor: theme.palette.grey[500],
    textDecorationThickness: '2px',
    textUnderlineOffset: '5px',
  },
}));

const UnderlinedText: FC<{ text: string | ReactNode }> = ({ text }) => {
  const classes = useStyles();
  return <Typography className={classes.text}>{text}</Typography>;
};

export default UnderlinedText;
