import { Box, Button, Typography } from '@mui/material';
import { FC, useState } from 'react';

import FileLibraryDialog from 'features/files/components/FileLibraryDialog';
import { LibraryImageData } from './types';
import messageIds from 'features/emails/l10n/messageIds';
import { Msg } from 'core/i18n';

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

  return (
    <>
      <Box display="flex">
        <Box
          height="80px"
          onClick={() => setSelecting(true)}
          sx={{ cursor: 'pointer' }}
          width="80px"
        >
          <img
            alt=""
            src={data.url}
            style={{
              height: '100%',
              objectFit: 'cover',
              width: '100%',
            }}
          />
        </Box>
        <Box
          alignItems="flex-start"
          display="flex"
          flex={1}
          flexDirection="column"
          justifyContent="space-between"
          overflow="hidden"
          paddingLeft={1}
        >
          <Typography
            maxWidth="80%"
            noWrap
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {data.fileName}
          </Typography>
          <Button onClick={() => setSelecting(true)} variant="outlined">
            <Msg id={messageIds.editor.tools.libraryImage.changeImage} />
          </Button>
        </Box>
      </Box>
      <FileLibraryDialog
        onClose={() => setSelecting(false)}
        onSelectFile={(file) => {
          setData({
            fileId: file.id,
            fileName: file.original_name,
            url: file.url,
          });
          onChange({
            fileId: file.id,
            fileName: file.original_name,
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
