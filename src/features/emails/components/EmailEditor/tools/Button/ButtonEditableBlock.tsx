import { FC } from 'react';
import { Box, useTheme } from '@mui/material';

import { ButtonData } from '.';

interface ButtonEditableBlockProps {
  data: ButtonData;
}

const ButtonEditableBlock: FC<ButtonEditableBlockProps> = ({ data }) => {
  const theme = useTheme();
  return (
    <Box display="flex" justifyContent="center" padding={2}>
      <Box
        alignItems="center"
        bgcolor={theme.palette.primary.main}
        color="white"
        display="flex"
        height="2rem"
        justifyContent="center"
        sx={{ cursor: 'pointer' }}
        width="5rem"
      >
        {data.buttonText || 'Button'}
      </Box>
    </Box>
  );
};

export default ButtonEditableBlock;
