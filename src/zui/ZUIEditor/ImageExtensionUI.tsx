import { useCommands, useExtensionEvent } from '@remirror/react';
import { FC, useState } from 'react';

import FileLibraryDialog from 'features/files/components/FileLibraryDialog';
import ImageExtension from './extensions/ImageExtension';

type Props = {
  orgId: number;
};

const ImageExtensionUI: FC<Props> = ({ orgId }) => {
  const [pos, setPos] = useState<number | null>(null);
  const { setImageFile } = useCommands();

  useExtensionEvent(ImageExtension, 'onCreate', (pos) => {
    setPos(pos);
  });

  useExtensionEvent(ImageExtension, 'onPick', (newPos) => {
    setPos(newPos);
  });

  return (
    <FileLibraryDialog
      onClose={() => {
        setPos(null);
      }}
      onSelectFile={(file) => {
        if (pos) {
          setImageFile(file, pos);
          setPos(null);
        }
      }}
      open={!!pos}
      orgId={orgId}
    />
  );
};

export default ImageExtensionUI;
