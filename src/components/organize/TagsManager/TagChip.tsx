import { HighlightOff } from '@material-ui/icons';
import { useState } from 'react';
import { Box, Tooltip } from '@material-ui/core';

import { ZetkinTag } from 'types/zetkin';

const TagChip: React.FunctionComponent<{
  onClickRemove?: (tag: ZetkinTag) => void;
  tag: ZetkinTag;
}> = ({ onClickRemove, tag }) => {
  const [hover, setHover] = useState(false);
  return (
    <Tooltip arrow title={tag.description}>
      <Box
        alignItems="center"
        bgcolor={tag.color || '#e1e1e1'}
        borderRadius="18px"
        display="flex"
        fontSize={13}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        px={hover ? 1.4 : 2}
        py={0.7}
      >
        {tag.title}
        {hover && onClickRemove && (
          <HighlightOff
            data-testid={`TagChip-removeButton-${tag.id}`}
            fontSize="small"
            onClick={() => onClickRemove(tag)}
            style={{
              cursor: 'pointer',
            }}
          />
        )}
      </Box>
    </Tooltip>
  );
};

export default TagChip;
