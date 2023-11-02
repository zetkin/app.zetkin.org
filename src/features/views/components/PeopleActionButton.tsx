import { Box } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogTitle, IconButton } from '@mui/material';
import { FC, useState } from 'react';
import {
  FolderOutlined,
  InsertDriveFileOutlined,
  UploadFileOutlined,
} from '@mui/icons-material';

import messageIds from '../l10n/messageIds';
import UploadFile from '../../import/components/UploadFile';
import { useMessages } from 'core/i18n';
import ViewBrowserModel from '../models/ViewBrowserModel';
import ZUIButtonMenu from 'zui/ZUIButtonMenu';

interface PeopleActionButtonProps {
  folderId: number | null;
  model: ViewBrowserModel;
}

const PeopleActionButton: FC<PeopleActionButtonProps> = ({
  folderId,
  model,
}) => {
  const messages = useMessages(messageIds);
  const [showDialog, setShowDialog] = useState(false);

  const handleClickOpen = () => {
    setShowDialog(true);
  };

  const handleClose = () => {
    setShowDialog(false);
  };

  return (
    <Box>
      <ZUIButtonMenu
        items={[
          {
            icon: <InsertDriveFileOutlined />,
            label: messages.actions.createView(),
            onClick: () => {
              model.createView(folderId || undefined);
            },
          },
          {
            icon: <FolderOutlined />,
            label: messages.actions.createFolder(),
            onClick: () => {
              model.createView(folderId || undefined);
            },
          },
          {
            icon: <UploadFileOutlined />,
            label: messages.actions.importPeople(),
            onClick: handleClickOpen,
          },
        ]}
        label={messages.actions.create()}
      />
      <Dialog onClose={handleClose} open={showDialog}>
        <DialogTitle sx={{ fontSize: 32 }}>
          {messages.actions.importPeople()}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
        <UploadFile />
      </Dialog>
    </Box>
  );
};

export default PeopleActionButton;
