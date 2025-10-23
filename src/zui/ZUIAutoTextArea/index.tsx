import React from 'react';
import { lighten, TextareaAutosize } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  textarea: {
    border: '2px dotted transparent',
    borderColor: lighten(theme.palette.primary.main, 0.65),
    borderRadius: 10,
    fontFamily: theme.typography.fontFamily,
    lineHeight: '1.5',
    overflow: 'hidden',
    padding: 10,
    resize: 'none',
    width: '100%',
  },
}));

interface ZUIAutoTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const ZUIAutoTextArea = React.forwardRef<
  HTMLTextAreaElement,
  ZUIAutoTextAreaProps
>(function ZetkinAutoTextArea(
  { onChange, value, placeholder, ...restProps },
  ref
) {
  const classes = useStyles();

  return (
    <TextareaAutosize
      ref={ref}
      className={classes.textarea}
      data-testid="AutoTextArea-textarea"
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      value={value}
      {...restProps}
    />
  );
});

export default ZUIAutoTextArea;
