import { Clear } from '@mui/icons-material';
import { Box, IconButton, Tooltip } from '@mui/material';
import { lighten } from '@mui/system';

import { DEFAULT_TAG_COLOR } from '../utils';
import { getContrastColor } from 'utils/colorUtils';
import { ZetkinAppliedTag, ZetkinTag } from 'utils/types/zetkin';

type TagChipSize = 'small' | 'medium' | 'large';

const isValueTag = (
  tag: ZetkinAppliedTag | ZetkinTag
): tag is ZetkinAppliedTag => {
  return tag.value_type == 'text';
};

const TagChip: React.FunctionComponent<{
  disabled?: boolean;
  noWrappedLabel?: boolean;
  onClick?: (tag: ZetkinTag) => void;
  onDelete?: (tag: ZetkinAppliedTag) => void;
  size?: TagChipSize;
  tag: ZetkinTag | ZetkinAppliedTag;
}> = ({ disabled = false, onClick, onDelete, size = 'medium', tag }) => {
  const clickable = !!onClick;
  const deletable = !!onDelete;
  const isAppliedTag = isValueTag(tag);

  const labelStyle = {
    '& > div': {
      maxWidth: '100%',
      overflow: 'hidden',
      transform: deletable ? 'translate(.5rem, 0)' : 'translate(0,0)',
      transition: 'transform 0.1s',
    },
    '&:hover': {
      '& > div': {
        transform: 'translate(0,0)',
        transition: 'transform 0.1s 0.1s',
      },
      '.deleteButton': {
        transform: 'translate(0,0)',
        transition: 'transform 0.1s 0.1s',
      },
    },
    backgroundColor: tag.color || DEFAULT_TAG_COLOR,
    color: getContrastColor(tag.color || DEFAULT_TAG_COLOR),
    display: 'flex',
    maxWidth: '100%',
    overflow: 'hidden',
    padding: isAppliedTag ? '.2em .2em .2em .6em' : '0.2em .6em',
    whiteSpace: 'nowrap',
  };

  const deleteButton = onDelete ? (
    <IconButton
      className="deleteButton"
      data-testid="TagChip-deleteButton"
      onClick={(ev) => {
        // Stop propagation to prevent regular onClick() from being invoked
        ev.stopPropagation();
        onDelete(tag as ZetkinAppliedTag);
      }}
      size="large"
      sx={{
        fontSize: '1.1rem',
        padding: 0,
        transform: 'translate(2rem, 0)',
        transition: 'transform 0.1s',
      }}
      tabIndex={-1}
    >
      <Clear
        fontSize="inherit"
        sx={{
          color: tag.value_type
            ? 'black'
            : getContrastColor(tag.color || DEFAULT_TAG_COLOR),
        }}
      />
    </IconButton>
  ) : null;

  return (
    <Box
      onClick={() => !disabled && onClick && onClick(tag)}
      sx={{
        borderRadius: '1em',
        cursor: clickable && !disabled ? 'pointer' : 'default',
        display: 'flex',
        fontSize: {
          large: '1.2em',
          medium: '1.0em',
          small: '0.8em',
        }[size],
        lineHeight: 'normal',
        opacity: disabled ? 0.5 : 1.0,
        overflow: 'hidden',
      }}
    >
      <Tooltip
        arrow
        title={
          <>
            {tag.title} <br /> {tag.description || ''}
          </>
        }
      >
        <Box sx={[labelStyle]}>
          <Box sx={{ display: 'flex', gap: '4px' }}>
            <Box
              className="title"
              data-testid="TagChip-value"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {tag.title}
            </Box>
            {isAppliedTag && (
              <Box
                className="valueArea"
                sx={{
                  backgroundColor: lighten(tag.color || DEFAULT_TAG_COLOR, 0.7),
                  borderRadius: '0 1em 1em 0',
                  minWidth: '3ch',
                  paddingInline: '3px',
                }}
              >
                {tag.value}
              </Box>
            )}
          </Box>
          {deleteButton}
        </Box>
      </Tooltip>
    </Box>
  );
};

export default TagChip;
