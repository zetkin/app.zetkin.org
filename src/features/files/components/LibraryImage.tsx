import Image from 'next/image';
import { Box, useTheme } from '@mui/material';
import { FC, useState } from 'react';

import { ZetkinFile } from 'utils/types/zetkin';

interface LibraryImageProps {
  highGridIntensity?: number;
  imageFile: ZetkinFile;
  interactive?: boolean;
  lowGridIntensity?: number;
}

const LibraryImage: FC<LibraryImageProps> = ({
  lowGridIntensity: defaultGridIntensity = 0.02,
  highGridIntensity: hoverGridIntensity = 0.15,
  imageFile,
  interactive = true,
}) => {
  const theme = useTheme();
  const [gridIntensity, setGridIntensity] = useState(
    interactive ? defaultGridIntensity : hoverGridIntensity
  );

  return (
    <Box
      border={1}
      borderColor={theme.palette.grey[400]}
      borderRadius={1}
      onMouseEnter={() => {
        setGridIntensity(hoverGridIntensity);
      }}
      onMouseLeave={() => {
        if (interactive) {
          setGridIntensity(defaultGridIntensity);
        }
      }}
      sx={{
        backgroundColor: '#eee',
        backgroundImage: `linear-gradient(45deg, rgba(0,0,0,${gridIntensity}) 25%, transparent 25%), linear-gradient(-45deg, rgba(0,0,0,${gridIntensity}) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(0,0,0,${gridIntensity}) 75%), linear-gradient(-45deg, transparent 75%, rgba(0,0,0,${gridIntensity}) 75%);`,
        backgroundPosition: '0 0, 0 15px, 15px -15px, -15px 0px',
        backgroundSize: '30px 30px',
        transition: 'backgroundImage 0.2s',
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
