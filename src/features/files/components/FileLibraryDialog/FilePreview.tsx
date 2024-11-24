import { FC, useState } from 'react';
import Image from 'next/image';
import { Box, Button, Typography } from '@mui/material';

import messageIds from 'features/files/l10n/messageIds';
import { Msg } from 'core/i18n';
import TransparentGridBackground from '../TransparentGridBackground';
import { ZetkinFile } from 'utils/types/zetkin';

type Props = {
  file: ZetkinFile;
  onBack: () => void;
  onSelect: () => void;
};

const FilePreview: FC<Props> = ({ file, onBack, onSelect }) => {
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box height="100%" my={2} overflow="auto">
        <TransparentGridBackground
          interactive={false}
          sx={{
            height: 'calc(100% - 4em)',
            position: 'relative',
          }}
        >
          <Image
            alt={file.original_name}
            height="800"
            onLoad={(e) => {
              if (e.target instanceof HTMLImageElement) {
                setDimensions({
                  height: e.target.naturalHeight,
                  width: e.target.naturalWidth,
                });
              }
            }}
            src={file.url}
            unoptimized
            style={{
              height: '100%',
              objectFit: 'contain',
              width: '100%',
            }}
            width="800"
          />
        </TransparentGridBackground>
        <Typography color="secondary" mt={1} textAlign="center" variant="body2">
          {file.original_name}
        </Typography>
        <Typography color="secondary" mt={1} textAlign="center" variant="body2">
          {dimensions.width} &times; {dimensions.height} pixels
        </Typography>
      </Box>
      <Box display="flex" gap={1} justifyContent="flex-end">
        <Button onClick={() => onBack()} variant="outlined">
          <Msg id={messageIds.libraryDialog.preview.backButton} />
        </Button>
        <Button
          data-testid="FileLibraryDialog-useButton"
          onClick={() => onSelect()}
          variant="contained"
        >
          <Msg id={messageIds.libraryDialog.preview.useButton} />
        </Button>
      </Box>
    </Box>
  );
};

export default FilePreview;
