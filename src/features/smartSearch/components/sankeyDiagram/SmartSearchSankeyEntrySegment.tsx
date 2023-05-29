import { FC } from 'react';
import SmartSearchSankeySegment from './SmartSearchSankeySegment';
import { useSankey } from './SmartSearchSankeyProvider';

const SmartSearchSankeyEntrySegment: FC = () => {
  const { config, entrySegment } = useSankey();

  return entrySegment ? (
    <SmartSearchSankeySegment config={config} segment={entrySegment} />
  ) : null;
};

export default SmartSearchSankeyEntrySegment;
