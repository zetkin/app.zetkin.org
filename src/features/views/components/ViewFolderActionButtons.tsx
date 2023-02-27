import { FC } from 'react';
import { Box, Button } from '@mui/material';
import { FolderOutlined, InsertDriveFileOutlined } from '@mui/icons-material';

import ViewBrowserModel from '../models/ViewBrowserModel';
import { Msg, useMessages } from 'core/i18n';

import messageIds from '../l10n/messageIds';

interface ViewFolderActionButtonsProps {
  folderId: number | null;
  model: ViewBrowserModel;
}

const ViewFolderActionButtons: FC<ViewFolderActionButtonsProps> = ({
  folderId,
  model,
}) => {
  const messages = useMessages(messageIds);
  return (
    <Box display="flex" gap={1}>
      <Button
        endIcon={<FolderOutlined />}
        onClick={() => {
          model.createFolder(messages.newFolderTitle(), folderId || undefined);
        }}
        variant="outlined"
      >
        <Msg id={messageIds.actions.createFolder} />
      </Button>
      <Button
        endIcon={<InsertDriveFileOutlined />}
        onClick={() => {
          model.createView(folderId || undefined);
        }}
        variant="contained"
      >
        <Msg id={messageIds.actions.createView} />
      </Button>
    </Box>
  );
};

export default ViewFolderActionButtons;
