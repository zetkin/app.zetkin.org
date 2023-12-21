import { FC } from 'react';
import { UploadFileOutlined } from '@mui/icons-material';
import { Box, IconButton, Link, Typography, useTheme } from '@mui/material';

import messageIds from 'features/files/l10n/messageIds';
import { useMessages } from 'core/i18n';

interface FileUploadCardProps {
  onFileBrowserOpen: () => void;
}

const FileUploadCard: FC<FileUploadCardProps> = ({ onFileBrowserOpen }) => {
  const messages = useMessages(messageIds);
  const theme = useTheme();

  return (
    <Box
      alignItems="center"
      bgcolor="transparent"
      border={2}
      borderColor={theme.palette.grey[300]}
      borderRadius={1}
      display="flex"
      flexDirection="column"
      height="100%"
      justifyContent="center"
      onClick={onFileBrowserOpen}
      sx={{
        borderStyle: 'dashed',
        cursor: 'pointer',
      }}
    >
      <IconButton
        onClick={onFileBrowserOpen}
        sx={{
          backgroundColor: theme.palette.grey[300],
          borderRadius: 100,
          cursor: 'pointer',
          height: '40px',
          padding: '30px',
          width: '40px',
        }}
      >
        <UploadFileOutlined
          sx={{ color: theme.palette.primary.main, fontSize: 40 }}
        />
      </IconButton>
      <Link
        onClick={onFileBrowserOpen}
        sx={{
          color: theme.palette.primary.main,
          cursor: 'pointer',
          paddingTop: 2,
          textDecorationLine: 'underline',
        }}
      >
        {messages.fileUpload.selectClick()}
      </Link>
      <Typography component="span" paddingTop={1}>
        {messages.fileUpload.instructions()}
      </Typography>
    </Box>
  );
};

export default FileUploadCard;
