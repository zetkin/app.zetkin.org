import { Clear } from '@mui/icons-material';
import { useState } from 'react';
import { Box, IconButton, lighten, Theme, Tooltip } from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';

import { DEFAULT_TAG_COLOR } from '../utils';
import { getContrastColor } from 'utils/colorUtils';
import { ZetkinTag } from 'utils/types/zetkin';

type TagChipSize = 'small' | 'medium' | 'large';

interface StyleProps {
  clickable: boolean;
  deletable: boolean;
  disabled: boolean;
  hover: boolean;
  size: TagChipSize;
  tag: ZetkinTag;
}

const useStyles = makeStyles<Theme, StyleProps>(() => ({
  chip: {
    borderRadius: '1em',
    cursor: ({ clickable, disabled }) =>
      clickable && !disabled ? 'pointer' : 'default',
    display: 'flex',
    fontSize: ({ size }) =>
      ({
        large: '1.2em',
        medium: '1.0em',
        small: '0.8em',
      }[size]),
    lineHeight: 'normal',
    marginRight: '0.1em',
    opacity: ({ disabled }) => (disabled ? 0.5 : 1.0),
    overflow: 'hidden',
  },
  deleteButton: {
    fontSize: '1.1rem',
    padding: '3px',
    position: 'absolute',
    right: '0.12em',
    transform: ({ deletable, hover }) =>
      deletable && hover ? 'translate(0,0)' : 'translate(2rem, 0)',
    transition: ({ deletable, hover }) =>
      deletable && hover ? 'transform 0.1s 0.1s' : 'transform 0.1s',
  },
  deleteContainer: {
    padding: ({ deletable, hover }) => {
      if (deletable) {
        return hover ? '0.2em 1.5em 0.2em 0.7em' : '0.2em 1em';
      } else {
        return '0.2em 0.6em';
      }
    },
    position: 'relative',
    transition: 'padding 0.1s',
  },
  deleteIcon: {
    color: ({ tag }) =>
      tag.value_type
        ? 'black'
        : getContrastColor(tag.color || DEFAULT_TAG_COLOR),
  },
  label: {
    backgroundColor: ({ tag }) => tag.color || DEFAULT_TAG_COLOR,
    color: ({ tag }) => getContrastColor(tag.color || DEFAULT_TAG_COLOR),
    maxWidth: '100%',
    overflow: 'hidden',
    padding: '0.2em 0.4em 0.2em 1em',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  value: {
    backgroundColor: ({ tag }) => lighten(tag.color || DEFAULT_TAG_COLOR, 0.7),
    maxWidth: '10em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
}));

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

const TagChip: React.FunctionComponent<{
  disabled?: boolean;
  noWrappedLabel?: boolean;
  onClick?: (tag: ZetkinTag) => void;
  onDelete?: (tag: ZetkinTag) => void;
  size?: TagChipSize;
  tag: ZetkinTag;
}> = ({ disabled = false, onClick, onDelete, size = 'medium', tag }) => {
  const [hover, setHover] = useState(false);
  const classes = useStyles({
    clickable: !!onClick,
    deletable: !!onDelete,
    disabled,
    hover,
    size,
    tag,
  });

  const deleteButton = onDelete ? (
    <IconButton
      className={classes.deleteButton}
      data-testid="TagChip-deleteButton"
      onClick={(ev) => {
        // Stop propagation to prevent regular onClick() from being invoked
        ev.stopPropagation();
        onDelete(tag);
      }}
      size="large"
      tabIndex={-1}
    >
      <Clear className={classes.deleteIcon} fontSize="inherit" />
    </IconButton>
  ) : null;

  return (
    <Box
      className={classes.chip}
      onClick={() => !disabled && onClick && onClick(tag)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {tag.value_type && (
        <>
          <TagToolTip tag={tag}>
            <Box className={classes.label}>{tag.title}</Box>
          </TagToolTip>
          <Tooltip arrow title={tag.value || ''}>
            <Box
              className={classes.value + ' ' + classes.deleteContainer}
              data-testid="TagChip-value"
            >
              {tag.value}
              {deleteButton}
            </Box>
          </Tooltip>
        </>
      )}
      {!tag.value_type && (
        <TagToolTip tag={tag}>
          <Box className={classes.label + ' ' + classes.deleteContainer}>
            {tag.title}
            {deleteButton}
          </Box>
        </TagToolTip>
      )}
    </Box>
  );
};

export default TagChip;
