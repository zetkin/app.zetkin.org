import { ZetkinTag as ZetkinTagType } from 'types/zetkin';
import { Chip, ChipProps, Tooltip } from '@material-ui/core';

const ZetkinTag: React.FunctionComponent<{
  chipProps?: ChipProps;
  tag: Partial<ZetkinTagType>;
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

export default ZetkinTag;
