import { Chip, ChipProps, Tooltip } from '@material-ui/core';

import { ZetkinTag } from 'types/zetkin';

const TagChip: React.FunctionComponent<{
  chipProps?: ChipProps;
  tag: ZetkinTag;
}> = ({ chipProps, tag }) => {
  return (
    <Tooltip arrow title={tag.description || ''}>
      <Chip
        {...chipProps}
        label={tag.title}
        style={{ background: tag.color || '#e1e1e1', ...chipProps?.style }}
      />
    </Tooltip>
  );
};

export default TagChip;
