import { Close, Delete, Edit } from '@mui/icons-material';
import { Box, Divider, IconButton } from '@mui/material';
import { FC, ReactNode } from 'react';

import PageBaseHeader from './PageBaseHeader';

type Props = {
  actions?: ReactNode;
  children?: ReactNode;
  color?: string | null;
  fullWidth?: boolean;
  onBack?: () => void;
  onClose?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  subtitle?: string;
  title: string;
};

const PageBase: FC<Props> = ({
  actions,
  children,
  color,
  fullWidth = false,
  onBack,
  onClose,
  onDelete,
  onEdit,
  subtitle,
  title,
}) => {
  return (
    <Box display="flex" flexDirection="column" height="100%" pt={2}>
      <PageBaseHeader
        color={color}
        iconButtons={
          <>
            {onEdit && (
              <IconButton onClick={onEdit}>
                <Edit />
              </IconButton>
            )}
            {onDelete && (
              <IconButton onClick={onDelete}>
                <Delete />
              </IconButton>
            )}
            {onClose && (
              <IconButton onClick={onClose}>
                <Close />
              </IconButton>
            )}
          </>
        }
        onBack={onBack}
        subtitle={subtitle}
        title={title}
      />
      <Divider />
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          position: 'relative',
          pt: 1,
          px: fullWidth ? 0 : 2,
        }}
      >
        {children}
      </Box>
      {actions && (
        <Box display="flex" flexDirection="column" gap={1} px={2} py={2}>
          {actions}
        </Box>
      )}
    </Box>
  );
};

export default PageBase;
