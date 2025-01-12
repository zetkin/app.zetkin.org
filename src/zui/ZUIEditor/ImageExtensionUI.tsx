import { useCommands, useExtensionEvent } from '@remirror/react';
import { FC, useState } from 'react';

import FileLibraryDialog from 'features/files/components/FileLibraryDialog';
import ImageExtension from './extensions/ImageExtension';

type Props = {
  orgId: number;
};

const ImageExtensionUI: FC<Props> = ({ orgId }) => {
  const [open, setOpen] = useState(false);
  const { setImageFile } = useCommands();

  useExtensionEvent(ImageExtension, 'onCreate', () => {
    setOpen(true);
  });

  return (
    <FileLibraryDialog
      onClose={() => {
        setOpen(false);
      }}
      onSelectFile={(file) => {
        setImageFile(file);
        setOpen(false);
      }}
      open={open}
      orgId={orgId}
    />
  );
};

export default ImageExtensionUI;
