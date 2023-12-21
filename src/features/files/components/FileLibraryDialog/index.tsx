import { Box } from '@mui/material';
import { FC } from 'react';

import messageIds from 'features/files/l10n/messageIds';
import useFiles from 'features/files/hooks/useFiles';
import { useMessages } from 'core/i18n';
import { ZetkinFile } from 'utils/types/zetkin';
import ZUIDialog from 'zui/ZUIDialog';
import ZUIFuture from 'zui/ZUIFuture';

type Props = {
  onClose: () => void;
  onSelectFile: (file: ZetkinFile) => void;
  open: boolean;
  orgId: number;
};

const FileLibraryDialog: FC<Props> = ({
  onClose,
  onSelectFile,
  open,
  orgId,
}) => {
  const filesFuture = useFiles(orgId);
  const messages = useMessages(messageIds);

  return (
    <ZUIDialog
      onClose={onClose}
      open={open}
      title={messages.libraryDialog.title()}
    >
      <ZUIFuture future={filesFuture}>
        {(data) => (
          <>
            {data.map((file) => (
              <Box key={file.id} onClick={() => onSelectFile(file)}>
                {file.original_name}
              </Box>
            ))}
          </>
        )}
      </ZUIFuture>
    </ZUIDialog>
  );
};

export default FileLibraryDialog;
