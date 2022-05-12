import { Clear } from '@material-ui/icons';
import { useState } from 'react';
import {
  Box,
  IconButton,
  lighten,
  makeStyles,
  Theme,
  Tooltip,
} from '@material-ui/core';

import { DEFAULT_TAG_COLOR } from './utils';
import { getContrastColor } from 'utils/colorUtils';
import { ZetkinTag } from 'types/zetkin';

interface StyleProps {
  clickable: boolean;
  deletable: boolean;
  disabled: boolean;
  hover: boolean;
  tag: ZetkinTag;
}

const useStyles = makeStyles<Theme, StyleProps>(() => ({
  chip: {
    borderRadius: '1em',
    cursor: ({ clickable, disabled }) =>
      clickable && !disabled ? 'pointer' : 'default',
    display: 'flex',
    lineHeight: 'normal',
    marginRight: '0.1em',
    opacity: ({ disabled }) => (disabled ? 0.5 : 1.0),
    overflow: 'hidden',
  },
  deleteButton: {
    fontSize: '0.8rem',
    padding: '3px',
    position: 'absolute',
    right: '0.2em',
    top: '0.3em',
    transform: ({ deletable, hover }) =>
      deletable && hover ? 'translate(0,0)' : 'translate(2rem, 0)',
    transition: ({ deletable, hover }) =>
      deletable && hover ? 'transform 0.1s 0.1s' : 'transform 0.1s',
  },
  deleteContainer: {
    padding: ({ deletable, hover }) =>
      deletable && hover ? '0.2em 1.6em 0.2em 0.4em' : '0.2em 1em',
    position: 'relative',
    transition: 'padding 0.1s',
  },
  deleteIcon: {
    color: ({ tag }) =>
      tag.value_type
        ? 'black'
        : getContrastColor(tag.color || DEFAULT_TAG_COLOR),
    fontSize: 'inherit',
  },
  label: {
    backgroundColor: ({ tag }) => tag.color || DEFAULT_TAG_COLOR,
    color: ({ tag }) => getContrastColor(tag.color || DEFAULT_TAG_COLOR),
    padding: '0.2em 0.4em 0.2em 1em',
  },
  value: {
    backgroundColor: ({ tag }) => lighten(tag.color || DEFAULT_TAG_COLOR, 0.7),
    maxWidth: '10em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
}));

const TagChip: React.FunctionComponent<{
  disabled?: boolean;
  onClick?: (tag: ZetkinTag) => void;
  onDelete?: (tag: ZetkinTag) => void;
  tag: ZetkinTag;
}> = ({ disabled = false, onClick, onDelete, tag }) => {
  const [hover, setHover] = useState(false);
  const classes = useStyles({
    clickable: !!onClick,
    deletable: !!onDelete,
    disabled,
    hover,
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
    >
      <Clear className={classes.deleteIcon} />
    </IconButton>
  ) : null;

  return (
    <Box
      className={classes.chip}
      onClick={() => onClick && onClick(tag)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {tag.value_type && (
        <>
          <Tooltip arrow title={tag.description || ''}>
            <Box className={classes.label}>{tag.title}</Box>
          </Tooltip>
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
        <Tooltip arrow title={tag.description || ''}>
          <Box className={classes.label + ' ' + classes.deleteContainer}>
            {tag.title}
            {deleteButton}
          </Box>
        </Tooltip>
      )}
    </Box>
  );
};

export default TagChip;
