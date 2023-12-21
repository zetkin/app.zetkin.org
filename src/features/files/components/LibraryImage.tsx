import { FC } from 'react';
import Image from 'next/image';
import { Box, useTheme } from '@mui/material';

import { ZetkinFile } from 'utils/types/zetkin';

interface LibraryImageProps {
  imageFile: ZetkinFile;
}

const LibraryImage: FC<LibraryImageProps> = ({ imageFile }) => {
  const theme = useTheme();

  return (
    <Box
      border={1}
      borderColor={theme.palette.grey[400]}
      borderRadius={1}
      sx={{
        backgroundImage:
          'linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%);',
        backgroundPosition: '0 0, 0 15px, 15px -15px, -15px 0px',
        backgroundSize: '30px 30px',
      }}
    >
      <Image
        alt={imageFile.original_name}
        height="100%"
        layout="responsive"
        objectFit="contain"
        src={imageFile.url}
        width="100%"
      />
    </Box>
  );
};

export default LibraryImage;
