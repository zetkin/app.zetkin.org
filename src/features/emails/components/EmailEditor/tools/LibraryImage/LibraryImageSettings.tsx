import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { FC, useState } from 'react';

import FileLibraryDialog from 'features/files/components/FileLibraryDialog';
import { LibraryImageData } from './types';
import messageIds from 'features/emails/l10n/messageIds';
import { Msg } from 'core/i18n';
import { PhotoOutlined } from '@mui/icons-material';

interface LibraryImageSettingsProps {
  data: LibraryImageData;
  onChange: (newData: LibraryImageData) => void;
  orgId: number;
}

const LibraryImageSettings: FC<LibraryImageSettingsProps> = ({
  data: initialData,
  onChange,
  orgId,
}) => {
  const [selecting, setSelecting] = useState(false);
  const [data, setData] = useState(initialData);
  const theme = useTheme();

  return (
    <>
      <Box
        alignItems="center"
        display="flex"
        height={200}
        justifyContent="center"
        onClick={() => setSelecting(true)}
        position="relative"
        sx={{ cursor: 'pointer' }}
      >
        <img
          alt=""
          src={data.url}
          style={{
            maxHeight: '100%',
            maxWidth: '100%',
          }}
        />
        <Box
          height="100%"
          position="absolute"
          sx={{
            background:
              'linear-gradient(180deg, transparent, rgba(1,1,1) 100%)',
          }}
          width="100%"
        />
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          sx={{ bottom: '10%', position: 'absolute' }}
        >
          <Box bgcolor={theme.palette.primary.main} borderRadius="100%">
            <IconButton onClick={() => setSelecting(true)}>
              <PhotoOutlined color="primary" />
            </IconButton>
          </Box>
          <Typography color="primary" sx={{ textDecoration: 'underline' }}>
            <Msg id={messageIds.editor.tools.libraryImage.changeImage} />
          </Typography>
        </Box>
      </Box>
      <FileLibraryDialog
        onClose={() => setSelecting(false)}
        onSelectFile={(file) => {
          setData({
            fileId: file.id,
            url: file.url,
          });
          onChange({
            fileId: file.id,
            url: file.url,
          });
          setSelecting(false);
        }}
        open={selecting}
        orgId={orgId}
        type="image"
      />
    </>
  );
};

export default LibraryImageSettings;
