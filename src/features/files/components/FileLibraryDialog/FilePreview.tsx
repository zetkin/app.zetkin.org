import { FC } from 'react';
import { Box, Button, Typography } from '@mui/material';

import LibraryImage from '../LibraryImage';
import messageIds from 'features/files/l10n/messageIds';
import { Msg } from 'core/i18n';
import { ZetkinFile } from 'utils/types/zetkin';

type Props = {
  file: ZetkinFile;
  onBack: () => void;
  onSelect: () => void;
};

const FilePreview: FC<Props> = ({ file, onBack, onSelect }) => {
  return (
    <Box>
      <Box my={2}>
        <LibraryImage imageFile={file} interactive={false} />
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
