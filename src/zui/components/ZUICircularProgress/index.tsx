import { CircularProgress } from '@mui/material';
import { FC } from 'react';

import { ZUISmall, ZUIMedium } from '../types';

interface ZUICircularProgressProps {
  /**
   The size of the componenent. Defaults to "medium".
   */
  size?: ZUISmall | ZUIMedium;
}

const ZUICircularProgress: FC<ZUICircularProgressProps> = ({
  size = 'medium',
}) => {
  return <CircularProgress size={size == 'medium' ? '2rem' : '1rem'} />;
};

export default ZUICircularProgress;
