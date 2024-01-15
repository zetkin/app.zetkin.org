import { FC } from 'react';
import { Box, Button } from '@mui/material';

const ButtonEditableBlock: FC = () => {
  return (
    <Box display="flex" justifyContent="center" padding={2}>
      <Button variant="contained">Button</Button>
    </Box>
  );
};

export default ButtonEditableBlock;
