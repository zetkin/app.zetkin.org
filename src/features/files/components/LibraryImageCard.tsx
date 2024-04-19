import { Box, CircularProgress, Typography } from '@mui/material';
import { FC, useState } from 'react';

import LibraryImage from './LibraryImage';
import { ZetkinFile } from 'utils/types/zetkin';

interface LibraryImageCardProps {
  imageFile: ZetkinFile;
  onSelectImage: () => void;
}

const LibraryImageCard: FC<LibraryImageCardProps> = ({
  imageFile,
  onSelectImage,
}) => {
  const [loading, setLoading] = useState(true);

  return (
    <Box
      display="flex"
      flexDirection="column"
      onClick={onSelectImage}
      sx={{ cursor: 'pointer' }}
    >
      <LibraryImage
        imageFile={imageFile}
        onLoad={() => setLoading(true)}
        onLoadingComplete={() => setLoading(false)}
      />
      <Box alignItems="center" display="flex" justifyContent="center" mt={1}>
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
      </Box>
    </Box>
  );
};

export default LibraryImageCard;
