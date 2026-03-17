import { Box, SvgIconTypeMap, Typography, useTheme } from '@mui/material';
import { ErrorOutlineOutlined } from '@mui/icons-material';
import { FC, MouseEventHandler, RefObject, useEffect, useState } from 'react';
import { OverridableComponent } from '@mui/material/OverridableComponent';

interface BlockListItemBaseProps {
  dropRef?: RefObject<HTMLDivElement | null>;
  hasErrors: boolean;
  icon: OverridableComponent<SvgIconTypeMap<Record<string, unknown>, 'svg'>>;
  isDragging?: boolean;
  isOver?: boolean;
  onSelect?: MouseEventHandler<HTMLDivElement>;
  selected: boolean;
  title: string;
}

const BlockListItemBase: FC<BlockListItemBaseProps> = ({
  dropRef,
  hasErrors,
  icon: Icon,
  isDragging,
  isOver,
  onSelect,
  selected,
  title,
}) => {
  const theme = useTheme();

  const [debouncedIsOver, setDebouncedIsOver] = useState(false);

  useEffect(() => {
    if (typeof isOver === 'undefined') {
      return;
    }

    const timeout = setTimeout(() => {
      setDebouncedIsOver(isOver);
    }, 50);

    return () => {
      clearTimeout(timeout);
    };
  }, [isOver]);

  return (
    <Box
      ref={dropRef}
      bgcolor={
        selected
          ? theme.palette.grey[300]
          : isDragging
            ? theme.palette.grey[400]
            : ''
      }
      display="flex"
      justifyContent="space-between"
      onClick={onSelect}
      padding={2}
      sx={{
        ...(onSelect && {
          ':hover': {
            bgcolor: selected ? '' : theme.palette.grey[200],
          },
          cursor: 'grab',
          userSelect: 'none',
        }),
        position: 'relative',
      }}
      width="100%"
    >
      {debouncedIsOver && (
        <Box
          sx={{
            borderTop: `2px solid ${theme.palette.primary.main}`,
            left: 0,
            position: 'absolute',
            right: 0,
            top: -1,
          }}
        />
      )}
      <Box display="flex" gap={2} width="80%">
        <Box sx={{ cursor: 'grab' }}>
          <Icon color="secondary" />
        </Box>
        <Box
          sx={{
            cursor: onSelect ? 'pointer' : 'default',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          <Typography noWrap>{title}</Typography>
        </Box>
      </Box>
      {hasErrors && (
        <ErrorOutlineOutlined
          color="error"
          fontSize="small"
          sx={{ marginRight: 1 }}
        />
      )}
    </Box>
  );
};

export default BlockListItemBase;
