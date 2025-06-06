import { Box, Button, DialogTitle, Divider } from '@mui/material';
import { FC } from 'react';

import ViewBrowser from 'features/views/components/ViewBrowser';
import messageIds from 'zui/l10n/messageIds';
import { Msg } from 'core/i18n';

type Props = {
  folderId: number | null;
  onClose: () => void;
  onFolderSelect: (folderId: number | null) => void;
  onViewSelect: (viewId: number) => void;
};

const BrowserStep: FC<Props> = ({
  folderId,
  onClose,
  onFolderSelect,
  onViewSelect,
}) => {
  return (
    <Box>
      {/* TODO #2789: Add more specific headline / decide whether to have a single headline across both steps */}
      <DialogTitle sx={{ paddingLeft: 1 }} variant="h4">
        Select people to add
      </DialogTitle>
      <ViewBrowser
        basePath=""
        folderId={folderId}
        onSelect={(item, ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          if (item.type == 'folder') {
            onFolderSelect(item.data.id);
          } else if (item.type == 'back') {
            onFolderSelect(item.folderId);
          } else if (item.type == 'view') {
            onViewSelect(item.data.id);
          }
        }}
        readOnly={true}
      />
      <Box>
        <Divider />
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            gap: 2,
            justifyContent: 'flex-end',
            mt: 2,
          }}
        >
          <Box>
            <Button
              onClick={() => {
                onClose();
              }}
              variant="text"
            >
              <Msg id={messageIds.personSelect.bulkAdd.cancelButton} />
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BrowserStep;
