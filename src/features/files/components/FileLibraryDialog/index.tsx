import { Box } from '@mui/material';
import { FC, useState } from 'react';

import FileLibraryBrowser from './FileLibraryBrowser';
import FilePreview from './FilePreview';
import messageIds from 'features/files/l10n/messageIds';
import { TypeOption } from 'features/files/types';
import useFileUploads from 'features/files/hooks/useFileUploads';
import { useMessages } from 'core/i18n';
import { ZetkinFile } from 'utils/types/zetkin';
import ZUIDialog from 'zui/ZUIDialog';

type Props = {
  onClose: () => void;
  onSelectFile: (file: ZetkinFile) => void;
  open: boolean;
  orgId: number;
  type?: TypeOption;
};

const FileLibraryDialog: FC<Props> = ({
  onClose,
  onSelectFile,
  open,
  orgId,
  type,
}) => {
  const [selectedFile, setSelectedFile] = useState<ZetkinFile | null>(null);
  const messages = useMessages(messageIds);

  const { getDropZoneProps } = useFileUploads(orgId, { multiple: false });

  return (
    <ZUIDialog
      maxWidth="lg"
      onClose={onClose}
      open={open}
      title={messages.libraryDialog.title()}
    >
      <Box {...getDropZoneProps()}>
        {selectedFile && (
          <FilePreview
            file={selectedFile}
            onBack={() => setSelectedFile(null)}
            onSelect={() => onSelectFile && onSelectFile(selectedFile)}
          />
        )}
        {!selectedFile && (
          <FileLibraryBrowser
            onSelectFile={(file) => {
              setSelectedFile(file);
            }}
            orgId={orgId}
            type={type}
          />
        )}
      </Box>
    </ZUIDialog>
  );
};

export default FileLibraryDialog;
