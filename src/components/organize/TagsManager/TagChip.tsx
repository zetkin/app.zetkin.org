import { Box, Tooltip } from '@material-ui/core';

import { ZetkinTag } from 'types/zetkin';

const TagChip: React.FunctionComponent<{ tag: ZetkinTag }> = ({ tag }) => {
  return (
    <Tooltip arrow title={tag.description}>
      <Box
        bgcolor={tag.color || '#e1e1e1'}
        borderRadius="18px"
        fontSize={13}
        px={2}
        py={0.7}
      >
        {tag.title}
      </Box>
    </Tooltip>
  );
};

export default TagChip;
