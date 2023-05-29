import { FC } from 'react';
import SmartSearchSankeySegment from './SmartSearchSankeySegment';
import { useSankey } from './SmartSearchSankeyProvider';

type SmartSearchSankeyFilterSegmentProps = {
  filterIndex: number;
};

const SmartSearchSankeyFilterSegment: FC<
  SmartSearchSankeyFilterSegmentProps
> = ({ filterIndex }) => {
  const { config, filterSegments } = useSankey();
  const segment = filterSegments[filterIndex];

  return segment ? (
    <SmartSearchSankeySegment config={config} segment={segment} />
  ) : null;
};

export default SmartSearchSankeyFilterSegment;
