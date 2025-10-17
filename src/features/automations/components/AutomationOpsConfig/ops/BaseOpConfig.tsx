import { Delete } from '@mui/icons-material';
import { Box, IconButton, Tooltip } from '@mui/material';
import { FC, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  icon: JSX.Element;
  label: string;
  onDelete: () => void;
};

const BaseOpConfig: FC<Props> = ({ children, icon, label, onDelete }) => {
  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        gap: 1,
        justifyContent: 'stretch',
      }}
    >
      <Box sx={{ flexGrow: 0 }}>
        <Tooltip title={label}>{icon}</Tooltip>
      </Box>
      <Box sx={{ flexGrow: 1 }}>{children}</Box>
      <Box sx={{ flexGrow: 0 }}>
        <IconButton onClick={() => onDelete()}>
          <Delete />
        </IconButton>
      </Box>
    </Box>
  );
};

export default BaseOpConfig;
