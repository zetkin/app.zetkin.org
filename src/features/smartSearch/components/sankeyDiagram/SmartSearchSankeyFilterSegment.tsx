import { FC } from 'react';
import SmartSearchSankeySegment from './SmartSearchSankeySegment';
import { useSankey } from './SmartSearchSankeyProvider';

type SmartSearchSankeyFilterSegmentProps = {
  filterIndex: number;
  hovered: boolean;
};

const SmartSearchSankeyFilterSegment: FC<
  SmartSearchSankeyFilterSegmentProps
> = ({ filterIndex, hovered }) => {
  const { config, filterSegments } = useSankey();
  const segment = filterSegments[filterIndex];

  return segment ? (
    <SmartSearchSankeySegment
      config={{
        ...config,
        color: hovered ? '#bbbbbb' : config.color,
      }}
      segment={segment}
    />
  ) : null;
};

export default SmartSearchSankeyFilterSegment;
