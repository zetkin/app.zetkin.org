import React from 'react';
import { Box, lighten, TextareaAutosize } from '@mui/material';

import oldTheme from 'theme';

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
  return (
    <Box
      ref={ref}
      component={TextareaAutosize}
      data-testid="AutoTextArea-textarea"
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
        onChange(e.target.value)
      }
      placeholder={placeholder}
      sx={{
        border: '2px dotted',
        borderColor: lighten(oldTheme.palette.primary.main, 0.65),
        borderRadius: '10px',
        fontFamily: oldTheme.typography.fontFamily,
        lineHeight: '1.5',
        overflow: 'hidden',
        padding: '10px',
        resize: 'none',
        width: '100%',
      }}
      value={value}
      {...restProps}
    />
  );
});

export default ZUIAutoTextArea;
