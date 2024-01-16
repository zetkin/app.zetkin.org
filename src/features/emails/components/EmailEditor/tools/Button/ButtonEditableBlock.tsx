import { FC } from 'react';
import { Box, useTheme } from '@mui/material';

const ButtonEditableBlock: FC = () => {
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
        Button
      </Box>
    </Box>
  );
};

export default ButtonEditableBlock;
