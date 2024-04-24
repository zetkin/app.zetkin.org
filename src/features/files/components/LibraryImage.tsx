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
        height="400"
        onLoad={() => onLoad && onLoad()}
        onLoadingComplete={() => onLoadingComplete && onLoadingComplete()}
        src={imageFile.url}
        style={{
          aspectRatio: '1 / 1',
          display: 'block',
          height: 'auto',
          objectFit: 'contain',
          width: '100%',
        }}
        width="400"
      />
    </TransparentGridBackground>
  );
};

export default LibraryImage;
