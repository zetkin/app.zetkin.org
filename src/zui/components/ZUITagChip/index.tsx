import { Clear } from '@mui/icons-material';
import { FC, useState } from 'react';
import { Box, IconButton, lighten, Tooltip, Typography } from '@mui/material';

import { ZetkinAppliedTag, ZetkinTag } from 'utils/types/zetkin';
import getTagContrastColor from './getTagContrastColor';

const ZUITagTooltip: FC<{
  children: JSX.Element;
  tag: ZetkinTag | ZetkinAppliedTag;
}> = ({ children, tag }) => (
  <Tooltip
    arrow
    enterDelay={1000}
    slotProps={{
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
    title={
      <>
        {tag.title} <br /> {tag.description || ''}
      </>
    }
  >
    {children}
  </Tooltip>
);

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
  const deletable = !!onDelete && !disabled;

  const deleteButton = onDelete ? (
    <IconButton
      data-testid="TagChip-deleteButton"
      onClick={(ev) => {
        // Stop propagation to prevent regular onClick() from being invoked
        ev.stopPropagation();
        onDelete(tag);
      }}
      sx={{
        fontSize: '0.875rem',
        padding: '0.188rem',
        position: 'absolute',
        right: '0.12em',
        transform: deletable && hover ? 'translate(0,0)' : 'translate(2rem, 0)',
        transition:
          deletable && hover ? 'transform 0.1s 0.1s' : 'transform 0.1s',
      }}
      tabIndex={-1}
    >
      <Clear
        sx={(theme) => ({
          color: tag.value_type
            ? theme.palette.common.black
            : getTagContrastColor(tag.color || theme.palette.grey[200]),
          fontSize: 'inherit',
        })}
      />
    </IconButton>
  ) : null;

  const hasValue = tag.value_type && 'value' in tag;

  const deleteContainerPadding = () => {
    if (deletable) {
      return hover ? '0.2em 1.5em 0.2em 0.7em' : '0.2em 1em';
    } else {
      return '0.2em 0.6em';
    }
  };

  return (
    <Box
      onClick={() => !disabled && onClick && onClick(tag)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={{
        borderRadius: '1rem',
        cursor: !!onClick && !disabled ? 'pointer' : 'default',
        display: 'inline-flex',
        marginRight: '0.1em',
        opacity: disabled ? 0.5 : 1.0,
        overflow: 'hidden',
      }}
    >
      {hasValue && (
        <>
          <ZUITagTooltip tag={tag}>
            <Box
              sx={(theme) => ({
                backgroundColor: tag.color || theme.palette.grey[200],
                color: getTagContrastColor(
                  tag.color || theme.palette.grey[200]
                ),
                maxWidth: '100%',
                overflow: 'hidden',
                padding: '0.2em 0.4em 0.2em 1em',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              })}
            >
              <Typography variant="labelSmMedium">{tag.title}</Typography>
            </Box>
          </ZUITagTooltip>
          <Tooltip
            arrow
            enterDelay={1000}
            slotProps={{
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
            title={tag.value || ''}
          >
            <Box
              data-testid="TagChip-value"
              sx={(theme) => ({
                backgroundColor: lighten(
                  tag.color || theme.palette.grey[200],
                  0.7
                ),
                maxWidth: '10em',
                overflow: 'hidden',
                padding: deleteContainerPadding(),
                position: 'relative',
                textOverflow: 'ellipsis',
                transition: 'padding 0.1s',
                whiteSpace: 'nowrap',
              })}
            >
              <Typography variant="labelSmMedium">{tag.value}</Typography>
              {deleteButton}
            </Box>
          </Tooltip>
        </>
      )}
      {!tag.value_type && (
        <ZUITagTooltip tag={tag}>
          <Box
            sx={(theme) => ({
              backgroundColor: tag.color || theme.palette.grey[200],
              color: getTagContrastColor(tag.color || theme.palette.grey[200]),
              maxWidth: '100%',
              overflow: 'hidden',
              padding: deleteContainerPadding(),
              position: 'relative',
              textOverflow: 'ellipsis',
              transition: 'padding 0.1s',
              whiteSpace: 'nowrap',
            })}
          >
            <Typography variant="labelSmMedium">{tag.title}</Typography>
            {deleteButton}
          </Box>
        </ZUITagTooltip>
      )}
    </Box>
  );
};

export default ZUITagChip;
