import { ArrowBackIos, Close, Edit } from '@mui/icons-material';
import { Box, Divider, IconButton, Typography } from '@mui/material';
import { FC, ReactNode } from 'react';

type Props = {
  actions?: ReactNode;
  children?: ReactNode;
  onBack?: () => void;
  onClose?: () => void;
  onEdit?: () => void;
  title: ReactNode;
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
        <Box display="flex" justifyContent="space-between" width="100%">
          <Box alignItems="center" display="flex">
            {onBack && (
              <IconButton onClick={() => onBack()}>
                <ArrowBackIos />
              </IconButton>
            )}
            <Typography variant="h6">{title}</Typography>
          </Box>
          <Box>
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
          </Box>
        </Box>
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
