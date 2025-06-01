import { Box, Button, Divider } from '@mui/material';
import { FC, useState } from 'react';

import ViewBrowser from 'features/views/components/ViewBrowser';
import messageIds from 'zui/l10n/messageIds';
import { Msg } from 'core/i18n';

type Props = {
  onClose: () => void;
  onViewSelect: (viewId: number) => void;
};

const BrowserStep: FC<Props> = ({ onClose, onViewSelect }) => {
  const [folderId, setFolderId] = useState<number | null>(null);
  return (
    <Box>
      <ViewBrowser
        basePath=""
        folderId={folderId}
        onSelect={(item, ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          if (item.type == 'folder') {
            setFolderId(item.data.id);
          } else if (item.type == 'back') {
            setFolderId(item.folderId);
          } else if (item.type == 'view') {
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
