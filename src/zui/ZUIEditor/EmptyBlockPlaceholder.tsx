import { Box, Typography } from '@mui/material';
import { usePositioner } from '@remirror/react';
import { FC } from 'react';

type Props = {
  placeholder: string;
};

const EmptyBlockPlaceholder: FC<Props> = ({ placeholder }) => {
  const positioner = usePositioner('emptyBlockStart');

  return (
    <Box ref={positioner.ref} position="relative">
      {positioner.active && (
        <Typography
          sx={{
            left: positioner.x,
            opacity: 0.5,
            pointerEvents: 'none',
            position: 'absolute',
            top: positioner.y,
          }}
        >
          {placeholder}
        </Typography>
      )}
    </Box>
  );
};

export default EmptyBlockPlaceholder;
