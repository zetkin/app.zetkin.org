import { Box, CircularProgress, Typography } from '@mui/material';
import { FC, useState } from 'react';

import LibraryImage from './LibraryImage';
import { ZetkinFile } from 'utils/types/zetkin';
import messageIds from 'features/files/l10n/messageIds';
import { Msg } from 'core/i18n';

interface LibraryImageCardProps {
  imageFile: ZetkinFile;
  onSelectImage: () => void;
}

const LibraryImageCard: FC<LibraryImageCardProps> = ({
  imageFile,
  onSelectImage,
}) => {
  const [loading, setLoading] = useState(true);
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });

  return (
    <Box
      display="flex"
      flexDirection="column"
      onClick={onSelectImage}
      sx={{ cursor: 'pointer' }}
    >
      <LibraryImage
        imageFile={imageFile}
        onLoad={(dimensions) => {
          setLoading(false);
          setDimensions(dimensions);
        }}
      />
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        mt={1}
      >
        {loading && (
          <CircularProgress color="primary" size="1em" sx={{ mr: 1 }} />
        )}
        <Typography
          alignSelf="center"
          color="secondary"
          component="span"
          maxWidth="80%"
          noWrap
          overflow="hidden"
          textOverflow="ellipsis"
          variant="body2"
        >
          {imageFile.original_name}
        </Typography>
        <Typography
          alignSelf="center"
          color="secondary"
          component="span"
          maxWidth="80%"
          noWrap
          overflow="hidden"
          textOverflow="ellipsis"
          variant="body2"
        >
          <Msg
            id={messageIds.image.dimensions}
            values={{ height: dimensions.height, width: dimensions.width }}
          />
        </Typography>
      </Box>
    </Box>
  );
};

export default LibraryImageCard;
