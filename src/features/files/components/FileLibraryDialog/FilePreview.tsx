import { FC } from 'react';
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
  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box height="100%" my={2} overflow="auto">
        <TransparentGridBackground
          interactive={false}
          sx={{
            height: 'calc(100% - 2em)',
            position: 'relative',
          }}
        >
          <Image
            alt={file.original_name}
            layout="fill"
            objectFit="contain"
            src={file.url}
          />
        </TransparentGridBackground>
        <Typography color="secondary" mt={1} textAlign="center" variant="body2">
          {file.original_name}
        </Typography>
      </Box>
      <Box display="flex" gap={1} justifyContent="flex-end">
        <Button onClick={() => onBack()} variant="outlined">
          <Msg id={messageIds.libraryDialog.preview.backButton} />
        </Button>
        <Button onClick={() => onSelect()} variant="contained">
          <Msg id={messageIds.libraryDialog.preview.useButton} />
        </Button>
      </Box>
    </Box>
  );
};

export default FilePreview;
