import { useState } from 'react';
import { Box, IconButton, useTheme } from '@mui/material';
import { Clear, Edit } from '@mui/icons-material';
import Image, { ImageProps } from 'next/image';

import FileLibraryDialog from 'features/files/components/FileLibraryDialog';
import messageIds from './l10n/messageIds';
import { Msg } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import { ZetkinFile } from 'utils/types/zetkin';

interface ZUIEditableImageProps {
  alt: string;
  file: ZetkinFile | null;
  onFileSelect: (file: ZetkinFile | null) => void;
}

const ZUIEditableImage: React.FC<
  ZUIEditableImageProps & Omit<ImageProps, 'src'>
> = ({ alt, file, onFileSelect, ...imageProps }) => {
  const theme = useTheme();
  const { orgId } = useNumericRouteParams();
  const [selecting, setSelecting] = useState(false);

  return (
    <Box style={{ position: 'relative' }}>
      <Box style={{ bottom: 10, position: 'absolute', right: 10, zIndex: 1 }}>
        {file && (
          <>
            <IconButton
              data-testid="ZetkinEditableImage-resetButton"
              onClick={() => onFileSelect(null)}
              size="large"
              style={{
                backgroundColor: 'rgba(255,255,255,0.7)',
                marginRight: 10,
              }}
            >
              <Clear />
            </IconButton>
            <IconButton
              data-testid="ZetkinEditableImage-editButton"
              onClick={() => setSelecting(true)}
              size="large"
              style={{
                backgroundColor: 'rgba(255,255,255,0.7)',
              }}
            >
              <Edit />
            </IconButton>
          </>
        )}
      </Box>
      {file && <Image {...imageProps} alt={alt} src={file.url} />}
      {!file && (
        <Box
          onClick={() => setSelecting(true)}
          sx={{
            alignItems: 'center',
            backgroundColor: theme.palette.grey[100],
            borderColor: theme.palette.grey[400],
            borderStyle: 'dashed',
            borderWidth: 2,
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            m: 1,
            px: 1,
            py: 3,
          }}
        >
          <Msg id={messageIds.editableImage.add} />
        </Box>
      )}
      <FileLibraryDialog
        onClose={() => {
          setSelecting(false);
        }}
        onSelectFile={(file) => {
          onFileSelect(file);
          setSelecting(false);
        }}
        open={selecting}
        orgId={orgId}
      />
    </Box>
  );
};

export default ZUIEditableImage;
