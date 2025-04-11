import { Box } from '@mui/material';
import { FC } from 'react';

import ZUIIconLabel, { ZUIIconLabelProps } from '../ZUIIconLabel';

type ZUIIconLabelRowProps = {
  /**
   * Use this property if you want all the icon-label pairs
   * to have the same color
   */
  color?: ZUIIconLabelProps['color'];

  /**
   * The list of icon-label pairs to be rendered in the row.
   *
   * You can use the props for each individual pair to
   * customize if it should look different than the other
   * pairs in the row.
   */
  iconLabels: ZUIIconLabelProps[];

  /**
   * Use this property if you want all the icon-label pairs
   * to have the same size.
   */
  size?: ZUIIconLabelProps['size'];
};

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
