import { useCommands, useEditorState } from '@remirror/react';
import { FC, useEffect, useState } from 'react';
import { getActiveNode } from 'remirror';

import FileLibraryDialog from 'features/files/components/FileLibraryDialog';

type Props = {
  orgId: number;
};

const ImageExtensionUI: FC<Props> = ({ orgId }) => {
  const [open, setOpen] = useState(false);
  const { setImageFile } = useCommands();

  const state = useEditorState();

  const nodeResult = getActiveNode({ state, type: 'zimage' });
  const node = nodeResult?.node;

  useEffect(() => {
    if (node && !node.attrs.src) {
      setOpen(true);
    }
  }, [node]);

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
