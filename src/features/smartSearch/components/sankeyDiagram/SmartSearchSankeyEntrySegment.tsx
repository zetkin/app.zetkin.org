import { FC } from 'react';
import { useTheme } from '@mui/material';

import SmartSearchSankeySegment from './SmartSearchSankeySegment';
import { useSankey } from './SmartSearchSankeyProvider';

type SmartSearchSankeyEntrySegmentProps = {
  hovered: boolean;
};

const SmartSearchSankeyEntrySegment: FC<SmartSearchSankeyEntrySegmentProps> = ({
  hovered,
}) => {
  const theme = useTheme();
  const { config, entrySegment } = useSankey();

  return entrySegment ? (
    <SmartSearchSankeySegment
      config={{
        ...config,
        color: hovered ? theme.palette.grey[400] : config.color,
      }}
      segment={entrySegment}
    />
  ) : null;
};

export default SmartSearchSankeyEntrySegment;
