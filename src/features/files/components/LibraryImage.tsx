import { FC, useRef } from 'react';
import Image from 'next/image';

import TransparentGridBackground from './TransparentGridBackground';
import { ZetkinFile } from 'utils/types/zetkin';

interface LibraryImageProps {
  imageFile: ZetkinFile;
  onLoad?: ({ height, width }: { height: number; width: number }) => void;
  onLoadingComplete?: ({
    height,
    width,
  }: {
    height: number;
    width: number;
  }) => void;
}

const LibraryImage: FC<LibraryImageProps> = ({
  imageFile,
  onLoad,
  onLoadingComplete,
}) => {
  const img = useRef<HTMLImageElement>(null);
  let dimensions = [0, 0];
  function updateSize() {
    if (img.current != null) {
      dimensions = [img.current.naturalWidth, img.current.naturalHeight];
    }
    return true;
  }

  return (
    <TransparentGridBackground>
      <Image
        ref={img}
        alt={imageFile.original_name}
        height="400"
        onLoad={() =>
          onLoad &&
          updateSize() &&
          onLoad({ height: dimensions[1], width: dimensions[0] })
        }
        onLoadingComplete={() =>
          onLoadingComplete &&
          updateSize() &&
          onLoadingComplete({ height: dimensions[1], width: dimensions[0] })
        }
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
