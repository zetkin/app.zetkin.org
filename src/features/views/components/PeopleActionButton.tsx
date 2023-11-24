import { Box, Dialog, IconButton, Typography } from '@mui/material';
import {
  Close,
  FolderOutlined,
  InsertDriveFileOutlined,
  UploadFileOutlined,
} from '@mui/icons-material';
import { FC, useState } from 'react';

import Importer from 'features/import/components/Importer';
import useCreateView from '../hooks/useCreateView';
import useFolder from '../hooks/useFolder';
import { useMessages } from 'core/i18n';
import ZUIButtonMenu from 'zui/ZUIButtonMenu';

import messageIds from '../l10n/messageIds';

interface PeopleActionButtonProps {
  folderId: number | null;
  orgId: number;
}

const PeopleActionButton: FC<PeopleActionButtonProps> = ({
  folderId,
  orgId,
}) => {
  const messages = useMessages(messageIds);
  const [importerDialogOpen, setImporterDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const createView = useCreateView(orgId);
  const { createFolder } = useFolder(orgId, folderId);

  return (
    <Box>
      <ZUIButtonMenu
        items={[
          {
            icon: <InsertDriveFileOutlined />,
            label: messages.actions.createView(),
            onClick: () => {
              createView(folderId || undefined);
            },
          },
          {
            icon: <FolderOutlined />,
            label: messages.actions.createFolder(),
            onClick: () => {
              createFolder(messages.newFolderTitle(), folderId || undefined);
            },
          },
          {
            icon: <UploadFileOutlined />,
            label: 'importer', //messages.actions.importPeople(),
            onClick: () => setImporterDialogOpen(true),
          },
          {
            icon: <UploadFileOutlined />,
            label: 'upload', //messages.actions.importPeople(),
            onClick: () => setUploadDialogOpen(true),
          },
        ]}
        label={messages.actions.create()}
      />
      <Dialog
        fullWidth
        onClose={() => setUploadDialogOpen(false)}
        open={uploadDialogOpen}
      >
        <Typography sx={{ fontSize: 32, padding: 2 }}>
          {messages.actions.importPeople()}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={() => setUploadDialogOpen(false)}
          sx={{
            color: (theme) => theme.palette.grey[500],
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <Close />
        </IconButton>
      </Dialog>
      <Importer
        onClose={() => setImporterDialogOpen(false)}
        open={importerDialogOpen}
      />
    </Box>
  );
};

export default PeopleActionButton;
