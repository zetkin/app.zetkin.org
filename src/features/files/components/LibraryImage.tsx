import { FC } from 'react';
import Image from 'next/image';

import TransparentGridBackground from './TransparentGridBackground';
import { ZetkinFile } from 'utils/types/zetkin';

interface LibraryImageProps {
  imageFile: ZetkinFile;
  onLoad?: ({ height, width }: { height: number; width: number }) => void;
}

const LibraryImage: FC<LibraryImageProps> = ({ imageFile, onLoad }) => {
  return (
    <TransparentGridBackground>
      <Image
        alt={imageFile.original_name}
        height="400"
        onLoad={(e) => {
          if (onLoad) {
            if (e.target instanceof HTMLImageElement) {
              onLoad({
                height: e.target.naturalHeight,
                width: e.target.naturalWidth,
              });
            } else {
              onLoad({ height: 0, width: 0 });
            }
          }
        }}
        src={imageFile.url}
        style={{
          aspectRatio: '1 / 1',
          display: 'block',
          height: 'auto',
          objectFit: 'contain',
          width: '100%',
        }}
        unoptimized
        width="400"
      />
    </TransparentGridBackground>
  );
};

export default LibraryImage;
