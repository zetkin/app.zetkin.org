import { FC } from 'react';
import SmartSearchSankeySegment from './SmartSearchSankeySegment';
import { useSankey } from './SmartSearchSankeyProvider';

const SmartSearchSankeyExitSegment: FC = () => {
  const { exitSegment } = useSankey();

  return exitSegment ? (
    <SmartSearchSankeySegment segment={exitSegment} />
  ) : null;
};

export default SmartSearchSankeyExitSegment;
