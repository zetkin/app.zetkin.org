import { Box, SvgIconTypeMap, Typography, useTheme } from '@mui/material';
import { ErrorOutlineOutlined } from '@mui/icons-material';
import { FC } from 'react';
import { OverridableComponent } from '@mui/material/OverridableComponent';

interface BlockListItemBaseProps {
  hasErrors: boolean;
  icon: OverridableComponent<SvgIconTypeMap<Record<string, unknown>, 'svg'>>;
  selected: boolean;
  title: string;
}

const BlockListItemBase: FC<BlockListItemBaseProps> = ({
  hasErrors,
  icon: Icon,
  selected,
  title,
}) => {
  const theme = useTheme();
  return (
    <Box
      bgcolor={selected ? theme.palette.grey[300] : ''}
      display="flex"
      justifyContent="space-between"
      padding={2}
      width="100%"
    >
      <Box display="flex" gap={2} width="80%">
        <Icon color="secondary" />
        <Box
          sx={{
            cursor: 'default',
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
