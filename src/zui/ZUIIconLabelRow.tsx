import { Box } from '@mui/material';
import { FC } from 'react';

import ZUIIconLabel, { ZUIIconLabelProps } from './ZUIIconLabel';

interface ZUIIconLabelRowProps {
  color?: ZUIIconLabelProps['color'];
  iconLabels: ZUIIconLabelProps[];
  size?: ZUIIconLabelProps['size'];
}

const ZUIIconLabelRow: FC<ZUIIconLabelRowProps> = ({
  iconLabels,
  ...restProps
}) => {
  return (
    <Box display="flex" flexShrink="0" gap={2}>
      {iconLabels.map((props, index) => (
        <ZUIIconLabel key={index} {...restProps} {...props} />
      ))}
    </Box>
  );
};

export default ZUIIconLabelRow;
