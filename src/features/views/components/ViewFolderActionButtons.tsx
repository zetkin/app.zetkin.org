import { FC } from 'react';
import { useRouter } from 'next/router';
import { Box, Button } from '@mui/material';
import { FolderOutlined, InsertDriveFileOutlined } from '@mui/icons-material';

import useViewBrowser from '../hooks/useViewBrowser';
import { Msg, useMessages } from 'core/i18n';

import messageIds from '../l10n/messageIds';

interface ViewFolderActionButtonsProps {
  folderId: number | null;
}

const ViewFolderActionButtons: FC<ViewFolderActionButtonsProps> = ({
  folderId,
}) => {
  const { orgId } = useRouter().query;
  const messages = useMessages(messageIds);
  const { createFolder, createView } = useViewBrowser(
    parseInt(orgId as string)
  );

  return (
    <Box display="flex" gap={1}>
      <Button
        endIcon={<FolderOutlined />}
        onClick={() => {
          createFolder(messages.newFolderTitle(), folderId || undefined);
        }}
        variant="outlined"
      >
        <Msg id={messageIds.actions.createFolder} />
      </Button>
      <Button
        endIcon={<InsertDriveFileOutlined />}
        onClick={() => {
          createView(folderId || undefined);
        }}
        variant="contained"
      >
        <Msg id={messageIds.actions.createView} />
      </Button>
    </Box>
  );
};

export default ViewFolderActionButtons;
