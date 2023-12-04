import { Box } from '@mui/material';
import { FC, useState } from 'react';
import {
  FolderOutlined,
  InsertDriveFileOutlined,
  UploadFileOutlined,
} from '@mui/icons-material';

import ImportDialog from 'features/import/components/ImportDialog';
import messageIds from '../l10n/messageIds';
import useCreateView from '../hooks/useCreateView';
import useFolder from '../hooks/useFolder';
import { useMessages } from 'core/i18n';
import ZUIButtonMenu from 'zui/ZUIButtonMenu';

interface PeopleActionButtonProps {
  folderId: number | null;
  orgId: number;
}

const PeopleActionButton: FC<PeopleActionButtonProps> = ({
  folderId,
  orgId,
}) => {
  const messages = useMessages(messageIds);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

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
            label: messages.actions.importPeople(),
            onClick: () => {
              setImportDialogOpen(true);
            },
          },
        ]}
        label={messages.actions.create()}
      />
      <ImportDialog
        onClose={() => setImportDialogOpen(false)}
        open={importDialogOpen}
      />
    </Box>
  );
};

export default PeopleActionButton;
