import { FC } from 'react';
import SmartSearchSankeySegment from './SmartSearchSankeySegment';
import { useSankey } from './SmartSearchSankeyProvider';

type SmartSearchSankeyEntrySegmentProps = {
  hovered: boolean;
};

const SmartSearchSankeyEntrySegment: FC<SmartSearchSankeyEntrySegmentProps> = ({
  hovered,
}) => {
  const { config, entrySegment } = useSankey();

  return entrySegment ? (
    <SmartSearchSankeySegment
      config={{
        ...config,
        color: hovered ? '#bbbbbb' : config.color,
      }}
      segment={entrySegment}
    />
  ) : null;
};

export default SmartSearchSankeyEntrySegment;
