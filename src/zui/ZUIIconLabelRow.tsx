import { Box } from '@mui/material';
import { FC } from 'react';
import ZUIIconLabel, { ZUIIconLabelProps } from './ZUIIconLabel';

interface ZUIIconLabelRowProps {
  iconLabels: ZUIIconLabelProps[];
}

const ZUIIconLabelRow: FC<ZUIIconLabelRowProps> = ({ iconLabels }) => {
  return (
    <Box display="flex" gap={2}>
      {iconLabels.map((props, index) => (
        <ZUIIconLabel key={index} {...props} />
      ))}
    </Box>
  );
};

export default ZUIIconLabelRow;
