import { Box, Button, Divider } from '@mui/material';
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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: '100%',
        position: 'relative',
      }}
    >
      <ViewBrowser
        autoHeight={false}
        basePath=""
        enableDragAndDrop={false}
        enableEllipsisMenu={false}
        folderId={folderId}
        onSelect={(item, ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          if (item.type === 'folder') {
            onFolderSelect(item.data.id);
          } else if (item.type === 'back') {
            onFolderSelect(item.folderId);
          } else if (item.type === 'view') {
            onViewSelect(item.data.id);
          }
        }}
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
