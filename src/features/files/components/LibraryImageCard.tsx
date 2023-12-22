import { FC } from 'react';
import { Box, Typography } from '@mui/material';

import LibraryImage from './LibraryImage';
import { truncateOnMiddle } from 'utils/stringUtils';
import { ZetkinFile } from 'utils/types/zetkin';

interface LibraryImageCardProps {
  imageFile: ZetkinFile;
  onSelectImage: () => void;
}

const LibraryImageCard: FC<LibraryImageCardProps> = ({
  imageFile,
  onSelectImage,
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      onClick={onSelectImage}
      sx={{ cursor: 'pointer' }}
    >
      <LibraryImage imageFile={imageFile} />
      <Typography
        alignSelf="center"
        color="secondary"
        paddingTop={1}
        variant="body2"
      >
        {truncateOnMiddle(imageFile.original_name, 24)}
      </Typography>
    </Box>
  );
};

export default LibraryImageCard;
