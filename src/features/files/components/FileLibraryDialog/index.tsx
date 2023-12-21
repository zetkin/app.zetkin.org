import { FC } from 'react';
import { Box, Dialog } from '@mui/material';

import useFiles from 'features/files/hooks/useFiles';
import { ZetkinFile } from 'utils/types/zetkin';
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

  return (
    <Dialog onClose={onClose} open={open}>
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
    </Dialog>
  );
};

export default FileLibraryDialog;
