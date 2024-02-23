import { FC } from 'react';
import Image from 'next/image';

import TransparentGridBackground from './TransparentGridBackground';
import { ZetkinFile } from 'utils/types/zetkin';

interface LibraryImageProps {
  imageFile: ZetkinFile;
  onLoad?: () => void;
  onLoadingComplete?: () => void;
}

const LibraryImage: FC<LibraryImageProps> = ({
  imageFile,
  onLoad,
  onLoadingComplete,
}) => {
  return (
    <TransparentGridBackground>
      <Image
        alt={imageFile.original_name}
        layout="responsive"
        objectFit="contain"
        onLoad={() => onLoad && onLoad()}
        onLoadingComplete={() => onLoadingComplete && onLoadingComplete()}
        src={imageFile.url}
      />
    </TransparentGridBackground>
  );
};

export default LibraryImage;
