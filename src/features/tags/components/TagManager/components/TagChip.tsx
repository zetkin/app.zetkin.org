import { Clear } from '@mui/icons-material';
import { useState } from 'react';
import { Box, IconButton, lighten, Tooltip } from '@mui/material';

import { DEFAULT_TAG_COLOR } from '../utils';
import { getContrastColor } from 'utils/colorUtils';
import { ZetkinAppliedTag, ZetkinTag } from 'utils/types/zetkin';

type TagChipSize = 'small' | 'medium' | 'large';

const TagToolTip: React.FunctionComponent<{
  children: JSX.Element;
  tag: ZetkinTag;
}> = ({ children, tag }) => {
  return (
    <Tooltip
      arrow
      title={
        <>
          {tag.title} <br /> {tag.description || ''}
        </>
      }
    >
      {children}
    </Tooltip>
  );
};

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
  const [hover, setHover] = useState(false);
  const clickable = !!onClick;
  const deletable = !!onDelete;
  const hasValue = isValueTag(tag);

  const labelStyle = {
    backgroundColor: tag.color || DEFAULT_TAG_COLOR,
    color: getContrastColor(tag.color || DEFAULT_TAG_COLOR),
    maxWidth: '100%',
    overflow: 'hidden',
    padding: '0.2em 0.4em 0.2em 1em',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };
  const deleteContainerStyle = {
    padding: deletable
      ? hover
        ? '0.2em 1.5em 0.2em 0.7em'
        : '0.2em 1em'
      : '0.2em 0.6em',
    position: 'relative',
    transition: 'padding 0.1s',
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
        fontSize: '1.1rem',
        padding: '3px',
        position: 'absolute',
        right: '0.12em',
        transform: deletable && hover ? 'translate(0,0)' : 'translate(2rem, 0)',
        transition:
          deletable && hover ? 'transform 0.1s 0.1s' : 'transform 0.1s',
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
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
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
        marginRight: '0.1em',
        opacity: disabled ? 0.5 : 1.0,
        overflow: 'hidden',
      }}
    >
      {hasValue && (
        <>
          <TagToolTip tag={tag}>
            <Box sx={labelStyle}>{tag.title}</Box>
          </TagToolTip>
          <Tooltip arrow title={tag.value || ''}>
            <Box
              data-testid="TagChip-value"
              sx={[
                {
                  backgroundColor: lighten(tag.color || DEFAULT_TAG_COLOR, 0.7),
                  maxWidth: '10em',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                },
                deleteContainerStyle,
              ]}
            >
              {tag.value}
              {deleteButton}
            </Box>
          </Tooltip>
        </>
      )}
      {!hasValue && (
        <TagToolTip tag={tag}>
          <Box sx={[labelStyle, deleteContainerStyle]}>
            {tag.title}
            {deleteButton}
          </Box>
        </TagToolTip>
      )}
    </Box>
  );
};

export default TagChip;
