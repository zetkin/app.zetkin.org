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
  title: string;
};

const PageBase: FC<Props> = ({
  actions,
  children,
  onBack,
  onClose,
  onEdit,
  title,
}) => {
  return (
    <Box display="flex" flexDirection="column">
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
          title={title}
        />
      </Box>
      <Divider />
      <Box flexGrow={1} overflow="hidden">
        {children}
      </Box>
      <Box display="flex" gap={1} justifyContent="center" paddingTop={1}>
        {actions}
      </Box>
    </Box>
  );
};

export default PageBase;
