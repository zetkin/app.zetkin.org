import { CircularProgress } from '@mui/material';
import { FC } from 'react';

interface ZUICircularProgressProps {
  size?: 'small' | 'medium';
}

const ZUICircularProgress: FC<ZUICircularProgressProps> = ({
  size = 'medium',
}) => {
  return (
    <CircularProgress
      size={size === 'small' ? 16 : 32}
      sx={{
        color: 'text.primary',
      }}
    />
  );
};

export default ZUICircularProgress;
