import { Typography } from '@mui/material';
import { FC, ReactNode } from 'react';

import oldTheme from 'theme';

const UnderlinedText: FC<{ text: string | ReactNode }> = ({ text }) => {
  return (
    <Typography
      sx={{
        display: 'inline',
        textDecoration: 'underline',
        textDecorationColor: oldTheme.palette.grey[500],
        textDecorationThickness: '2px',
        textUnderlineOffset: '5px',
      }}
    >
      {text}
    </Typography>
  );
};

export default UnderlinedText;
