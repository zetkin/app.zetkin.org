import { Close, Edit } from '@mui/icons-material';
import { Box, Divider, IconButton } from '@mui/material';
import { FC, ReactNode } from 'react';

import PageBaseHeader from './PageBaseHeader';

type Props = {
  actions?: ReactNode;
  children?: ReactNode;
  onBack?: () => void;
  onClose?: () => void;
  onEdit?: () => void;
  subtitle?: string;
  title: string;
};

const PageBase: FC<Props> = ({
  actions,
  children,
  onBack,
  onClose,
  onEdit,
  subtitle,
  title,
}) => {
  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box
        paddingBottom={1}
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <PageBaseHeader
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
      </Box>
      <Divider />
      <Box flexGrow={1} sx={{ overflowY: 'auto' }}>
        {children}
      </Box>
      <Box display="flex" flexDirection="column" gap={1} paddingTop={1}>
        {actions}
      </Box>
    </Box>
  );
};

export default PageBase;
