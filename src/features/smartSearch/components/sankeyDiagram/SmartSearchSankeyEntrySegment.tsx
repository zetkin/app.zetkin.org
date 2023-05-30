import { FC } from 'react';
import SmartSearchSankeySegment from './SmartSearchSankeySegment';
import { useSankey } from './SmartSearchSankeyProvider';
import { useTheme } from '@mui/material';

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
