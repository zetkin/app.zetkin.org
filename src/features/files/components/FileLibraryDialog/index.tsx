import { Box } from '@mui/material';
import { FC, useState } from 'react';

import FileDropZone from '../FileDropZone';
import FileLibraryBrowser from './FileLibraryBrowser';
import FilePreview from './FilePreview';
import messageIds from 'features/files/l10n/messageIds';
import { TypeOption } from 'features/files/types';
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

  return (
    <ZUIDialog
      contentHeight="80vh"
      maxWidth="lg"
      onClose={onClose}
      open={open}
      title={messages.libraryDialog.title()}
    >
      <Box height="100%">
        {selectedFile && (
          <FilePreview
            file={selectedFile}
            onBack={() => setSelectedFile(null)}
            onSelect={() => onSelectFile && onSelectFile(selectedFile)}
          />
        )}
        {!selectedFile && (
          <FileDropZone orgId={orgId}>
            {({ openFilePicker }) => (
              <FileLibraryBrowser
                onFileBrowserOpen={() => openFilePicker()}
                onSelectFile={(file) => {
                  setSelectedFile(file);
                }}
                orgId={orgId}
                type={type}
              />
            )}
          </FileDropZone>
        )}
      </Box>
    </ZUIDialog>
  );
};

export default FileLibraryDialog;
