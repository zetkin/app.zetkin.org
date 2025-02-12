import { Box, SvgIconTypeMap, Typography } from '@mui/material';
import { ErrorOutlineOutlined } from '@mui/icons-material';
import { FC } from 'react';
import { OverridableComponent } from '@mui/material/OverridableComponent';

interface BlockListItemBaseProps {
  hasErrors: boolean;
  icon: OverridableComponent<SvgIconTypeMap<Record<string, unknown>, 'svg'>>;
  title: string;
}

const BlockListItemBase: FC<BlockListItemBaseProps> = ({
  hasErrors,
  icon: Icon,
  title,
}) => {
  return (
    <Box display="flex" justifyContent="space-between" padding={2}>
      <Box display="flex" gap={2}>
        <Icon color="secondary" />
        <Typography
          maxWidth="90%"
          noWrap
          overflow="hidden"
          sx={{ cursor: 'default' }}
          textOverflow="ellipsis"
        >
          {title}
        </Typography>
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
