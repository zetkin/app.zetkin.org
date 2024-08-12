import { FC } from 'react';

import SmartSearchSankeySegment from './SmartSearchSankeySegment';
import { useSankey } from './SmartSearchSankeyProvider';

const SmartSearchSankeyExitSegment: FC = () => {
  const { config, exitSegment } = useSankey();

  return exitSegment ? (
    <SmartSearchSankeySegment config={config} segment={exitSegment} />
  ) : null;
};

export default SmartSearchSankeyExitSegment;
