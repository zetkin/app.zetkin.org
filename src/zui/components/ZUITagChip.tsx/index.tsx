import { Clear } from '@mui/icons-material';
import { FC, useState } from 'react';
import {
  Box,
  IconButton,
  lighten,
  Theme,
  Tooltip,
  Typography,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import { ZetkinAppliedTag, ZetkinTag } from 'utils/types/zetkin';
import getTagContrastColor from './getTagContrastColor';

interface StyleProps {
  clickable: boolean;
  deletable: boolean;
  disabled: boolean;
  hover: boolean;
  tag: ZetkinTag;
}

const useStyles = makeStyles<Theme, StyleProps>((theme) => ({
  chip: {
    borderRadius: '1rem',
    cursor: ({ clickable, disabled }) =>
      clickable && !disabled ? 'pointer' : 'default',
    display: 'inline-flex',
    marginRight: '0.1em',
    opacity: ({ disabled }) => (disabled ? 0.5 : 1.0),
    overflow: 'hidden',
  },
  deleteButton: {
    fontSize: '0.875rem',
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
        : getTagContrastColor(tag.color || theme.palette.grey[200]),
  },
  label: {
    backgroundColor: ({ tag }) => tag.color || theme.palette.grey[200],
    color: ({ tag }) =>
      getTagContrastColor(tag.color || theme.palette.grey[200]),
    maxWidth: '100%',
    overflow: 'hidden',
    padding: '0.2em 0.4em 0.2em 1em',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  value: {
    backgroundColor: ({ tag }) =>
      lighten(tag.color || theme.palette.grey[200], 0.7),
    maxWidth: '10em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
}));

const ZUITagTooltip: FC<{
  children: JSX.Element;
  tag: ZetkinTag | ZetkinAppliedTag;
}> = ({ children, tag }) => {
  return (
    <Tooltip
      arrow
      componentsProps={{
        arrow: {
          sx: {
            color: '#616161E5',
          },
        },
        tooltip: {
          sx: {
            backgroundColor: '#616161E5',
            fontSize: '0.625rem',
            fontWeight: 600,
            lineHeight: '0.875rem',
          },
        },
      }}
      enterDelay={1000}
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

type ZUITagChipProps = {
  /**
   * If the tag is disabled.
   * Defaults to "false".
   */
  disabled?: boolean;

  /**
   * The functions that runs when clicking the tag.
   */
  onClick?: (tag: ZetkinTag) => void;

  /**
   * If you pass in an onDelete function the tag will
   * render with a little "x" that appears when hovered,
   * and this function will run when clicking that little "x".
   */
  onDelete?: (tag: ZetkinTag) => void;

  /**
   * The tag to be displayed.
   */
  tag: ZetkinTag | ZetkinAppliedTag;
};

const ZUITagChip: FC<ZUITagChipProps> = ({
  disabled = false,
  onClick,
  onDelete,
  tag,
}) => {
  const [hover, setHover] = useState(false);
  const classes = useStyles({
    clickable: !!onClick,
    deletable: !!onDelete && !disabled,
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
      tabIndex={-1}
    >
      <Clear className={classes.deleteIcon} sx={{ fontSize: 'inherit' }} />
    </IconButton>
  ) : null;

  const hasValue = tag.value_type && 'value' in tag;

  return (
    <Box
      className={classes.chip}
      onClick={() => !disabled && onClick && onClick(tag)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hasValue && (
        <>
          <ZUITagTooltip tag={tag}>
            <Box className={classes.label}>
              <Typography variant="labelSmMedium">{tag.title}</Typography>
            </Box>
          </ZUITagTooltip>
          <Tooltip
            arrow
            componentsProps={{
              arrow: {
                sx: {
                  color: '#616161E5',
                },
              },
              tooltip: {
                sx: {
                  backgroundColor: '#616161E5',
                  fontSize: '0.625rem',
                  fontWeight: 600,
                  lineHeight: '0.875rem',
                },
              },
            }}
            enterDelay={1000}
            title={tag.value || ''}
          >
            <Box
              className={classes.value + ' ' + classes.deleteContainer}
              data-testid="TagChip-value"
            >
              <Typography variant="labelSmMedium">{tag.value}</Typography>
              {deleteButton}
            </Box>
          </Tooltip>
        </>
      )}
      {!tag.value_type && (
        <ZUITagTooltip tag={tag}>
          <Box className={classes.label + ' ' + classes.deleteContainer}>
            <Typography variant="labelSmMedium">{tag.title}</Typography>
            {deleteButton}
          </Box>
        </ZUITagTooltip>
      )}
    </Box>
  );
};

export default ZUITagChip;
