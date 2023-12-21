import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { FC, useState } from 'react';

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
  const [sorting, setSorting] = useState('date');
  const filesFuture = useFiles(orgId);
  const messages = useMessages(messageIds);

  return (
    <ZUIDialog
      onClose={onClose}
      open={open}
      title={messages.libraryDialog.title()}
    >
      <Box display="flex" mt={1}>
        <FormControl fullWidth>
          <InputLabel>{messages.sorting.label()}</InputLabel>
          <Select
            label={messages.sorting.label()}
            onChange={(ev) => setSorting(ev.target.value)}
            value={sorting}
          >
            <MenuItem value="date">{messages.sorting.options.date()}</MenuItem>
            <MenuItem value="originalName">
              {messages.sorting.options.originalName()}
            </MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box>
        <ZUIFuture future={filesFuture}>
          {(allFiles) => {
            const sortedFiles = allFiles.sort((f0, f1) => {
              if (sorting == 'originalName') {
                return f0.original_name.localeCompare(f1.original_name);
              } else {
                const d0 = new Date(f0.uploaded);
                const d1 = new Date(f1.uploaded);
                return d1.getTime() - d0.getTime();
              }
            });

            return (
              <>
                {sortedFiles.map((file) => (
                  <Box key={file.id} onClick={() => onSelectFile(file)}>
                    {file.original_name}
                  </Box>
                ))}
              </>
            );
          }}
        </ZUIFuture>
      </Box>
    </ZUIDialog>
  );
};

export default FileLibraryDialog;
