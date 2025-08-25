import { Close, Edit } from '@mui/icons-material';
import { Box, Divider, IconButton } from '@mui/material';
import { FC, ReactNode } from 'react';

import PageBaseHeader from './PageBaseHeader';

type Props = {
  actions?: ReactNode;
  children?: ReactNode;
  color?: string | null;
  onBack?: () => void;
  onClose?: () => void;
  onEdit?: () => void;
  subtitle?: string;
  title: string;
};

const PageBase: FC<Props> = ({
  actions,
  children,
  color,
  onBack,
  onClose,
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
      <Box flexGrow={1} p={2} sx={{ overflowY: 'auto', position: 'relative' }}>
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
