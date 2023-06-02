import { FC } from 'react';
import SmartSearchSankeySegment from './SmartSearchSankeySegment';
import { useSankey } from './SmartSearchSankeyProvider';
import { useTheme } from '@mui/material';

type SmartSearchSankeyFilterSegmentProps = {
  filterIndex: number;
  hovered: boolean;
};

const SmartSearchSankeyFilterSegment: FC<
  SmartSearchSankeyFilterSegmentProps
> = ({ filterIndex, hovered }) => {
  const theme = useTheme();
  const { config, filterSegments } = useSankey();
  const segment = filterSegments[filterIndex];

  return segment ? (
    <SmartSearchSankeySegment
      config={{
        ...config,
        color: hovered ? theme.palette.grey[400] : config.color,
      }}
      segment={segment}
    />
  ) : null;
};

export default SmartSearchSankeyFilterSegment;
