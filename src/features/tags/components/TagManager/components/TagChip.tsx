import { Clear } from '@mui/icons-material';
import { Box, IconButton, Tooltip } from '@mui/material';
import { lighten, rgbToHex } from '@mui/system';

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

  const commonTextStyle = {
    maxWidth: '100%',
    overflow: 'hidden',
    padding: '0.125rem 0.75rem ',
    textOverflow: 'ellipsis',
    transition: 'translate 0.1s',
    whiteSpace: 'nowrap',
  };

  const deleteButton = onDelete ? (
    <IconButton
      data-testid="TagChip-deleteButton"
      onClick={(ev) => {
        // Stop propagation to prevent regular onClick() from being invoked
        ev.stopPropagation();
        onDelete(tag as ZetkinAppliedTag);
      }}
      size="large"
      sx={{
        bottom: 0,
        fontSize: '1.1rem',
        left: '100%',
        padding: 0,
        position: 'absolute',
        top: 0,
        transition: 'translate 0.1s',
        translate: '0',
      }}
      tabIndex={-1}
    >
      <Clear
        fontSize="inherit"
        sx={{
          color: isAppliedTag
            ? getContrastColor(
                rgbToHex(lighten(tag.color || DEFAULT_TAG_COLOR, 0.7))
              )
            : getContrastColor(tag.color || DEFAULT_TAG_COLOR),
        }}
      />
    </IconButton>
  ) : null;

  return (
    <Box
      onClick={() => !disabled && onClick && onClick(tag)}
      sx={{
        '& > span': { maxWidth: '100%' },
        '&:hover': {
          button: {
            transition: 'translate 0.1s 0.1s',
            translate: '-1.25rem  0',
          },
          'div:last-of-type': {
            translate: deletable ? '-0.5rem 0' : '0',
          },
        },

        alignContent: 'center',
        backgroundColor: isAppliedTag
          ? lighten(tag.color || DEFAULT_TAG_COLOR, 0.7)
          : 'currentColor',
        border: '0.0625rem solid currentColor',
        borderRadius: '1rem',
        color: tag.color || DEFAULT_TAG_COLOR,
        cursor: clickable && !disabled ? 'pointer' : 'default',
        display: 'inline-flex',
        fontSize: {
          large: '1.2em',
          medium: '1.0em',
          small: '0.8em',
        }[size],
        lineHeight: 'normal',
        opacity: disabled ? 0.5 : 1.0,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Tooltip
        arrow
        title={
          <>
            <Box component="p" sx={{ margin: 0 }}>
              <span>{tag.title}</span>
              {isAppliedTag && tag.value && (
                <Box component="span">: {tag.value}</Box>
              )}
            </Box>
            {tag.description && (
              <Box component="p" sx={{ marginBottom: 0 }}>
                {tag.description}
              </Box>
            )}
          </>
        }
      >
        <Box
          component="span"
          sx={{
            display: 'flex',
          }}
        >
          <Box
            className="title"
            data-testid="TagChip-value"
            sx={{
              backgroundColor: tag.color || DEFAULT_TAG_COLOR,
              ...commonTextStyle,
              color: getContrastColor(tag.color || DEFAULT_TAG_COLOR),
            }}
          >
            {tag.title}
          </Box>
          {isAppliedTag && (
            <Box
              className="valueArea"
              sx={{
                ...commonTextStyle,
                color: getContrastColor(
                  rgbToHex(lighten(tag.color || DEFAULT_TAG_COLOR, 0.7))
                ),
                minWidth: '3ch',
              }}
            >
              {tag.value}
            </Box>
          )}
        </Box>
      </Tooltip>
      {deleteButton}
    </Box>
  );
};

export default TagChip;
