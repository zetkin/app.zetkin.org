import { FC } from 'react';
import SmartSearchSankeySegment from './SmartSearchSankeySegment';
import { useSankey } from './SmartSearchSankeyProvider';

const SmartSearchSankeyEntrySegment: FC = () => {
  const { entrySegment } = useSankey();

  return entrySegment ? (
    <SmartSearchSankeySegment segment={entrySegment} />
  ) : null;
};

export default SmartSearchSankeyEntrySegment;
