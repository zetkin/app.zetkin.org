import { FC, useState } from 'react';
import Image from 'next/image';
import { Box, Button, Divider, Grid, Typography } from '@mui/material';

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
            style={{
              height: '100%',
              objectFit: 'contain',
              width: '100%',
            }}
            unoptimized
            width="800"
          />
        </TransparentGridBackground>
        <Typography color="secondary" mt={1} textAlign="center" variant="body2">
          {file.original_name}
        </Typography>
        <Typography color="secondary" mt={1} textAlign="center" variant="body2">
          <Msg
            id={messageIds.image.dimensions}
            values={{ height: dimensions.height, width: dimensions.width }}
          />
        </Typography>
      </Box>
      <Divider />
      <Typography mt={2} variant="h6">
        <Msg id={messageIds.libraryDialog.preview.previewsSection} />
      </Typography>
      <Typography color="secondary" variant="body2">
        <Msg id={messageIds.libraryDialog.preview.cropWarning} />
      </Typography>
      <Grid container my={2}>
        <Grid mr={2} size={{ lg: 1, md: 2, xs: 6 }}>
          <TransparentGridBackground
            interactive={false}
            sx={{
              height: 90,
              maxWidth: '100px',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <Image
              alt={`${file.original_name}-square`}
              height="100"
              src={file.url}
              style={{
                height: '100%',
                objectFit: 'cover',
                width: '100%',
              }}
              unoptimized
              width="100"
            />
          </TransparentGridBackground>
          <Typography
            color="secondary"
            mt={1}
            textAlign="center"
            variant="body2"
          >
            <Msg id={messageIds.libraryDialog.preview.cropSquare} />
          </Typography>
        </Grid>
        <Grid mr={2} size={{ lg: 2, md: 3, xs: 8 }}>
          <TransparentGridBackground
            interactive={false}
            sx={{
              height: 90,
              maxWidth: '300px',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <Image
              alt={`${file.original_name}-landscape`}
              height="100"
              src={file.url}
              style={{
                height: '100%',
                objectFit: 'cover',
                width: '100%',
              }}
              unoptimized
              width="350"
            />
          </TransparentGridBackground>
          <Typography
            color="secondary"
            mt={1}
            textAlign="center"
            variant="body2"
          >
            <Msg id={messageIds.libraryDialog.preview.cropLandscape} />
          </Typography>
        </Grid>
        <Grid size={{ lg: 8, md: 10, xs: 12 }}>
          <TransparentGridBackground
            interactive={false}
            sx={{
              height: 90,
              maxWidth: '100%',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <Image
              alt={`${file.original_name}-wide`}
              height="100"
              src={file.url}
              style={{
                height: '100%',
                objectFit: 'cover',
                width: '100%',
              }}
              unoptimized
              width="850"
            />
          </TransparentGridBackground>
          <Typography
            color="secondary"
            mt={1}
            textAlign="center"
            variant="body2"
          >
            <Msg id={messageIds.libraryDialog.preview.cropWide} />
          </Typography>
        </Grid>
      </Grid>
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
