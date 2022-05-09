import { useState } from 'react';
import { Box, Chip, ChipProps, Tooltip } from '@material-ui/core';

import { DEFAULT_TAG_COLOR } from './utils';
import { ZetkinTag } from 'types/zetkin';

const TagChip: React.FunctionComponent<{
  chipProps?: ChipProps;
  onDelete?: (tag: ZetkinTag) => void;
  tag: ZetkinTag;
}> = ({ chipProps, onDelete, tag }) => {
  const [hover, setHover] = useState(false);
  return (
    <Tooltip arrow title={tag.description || ''}>
      <Box
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <Chip
          onDelete={hover && onDelete ? () => onDelete(tag) : undefined}
          {...chipProps}
          label={tag.title}
          style={{
            background: tag.color || DEFAULT_TAG_COLOR,
            ...chipProps?.style,
          }}
        />
      </Box>
    </Tooltip>
  );
};

export default TagChip;
