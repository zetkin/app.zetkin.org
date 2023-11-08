import { Box } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, IconButton, Typography } from '@mui/material';
import { FC, useState } from 'react';
import {
  FolderOutlined,
  InsertDriveFileOutlined,
  UploadFileOutlined,
} from '@mui/icons-material';

import messageIds from '../l10n/messageIds';
import UploadFile from '../../import/components/Upload/UploadFile';
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
  const [showDialog, setShowDialog] = useState(false);

  const handleClick = () => {
    setShowDialog(!showDialog);
  };
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
            onClick: handleClick,
          },
        ]}
        label={messages.actions.create()}
      />
      <Dialog onClose={handleClick} open={showDialog}>
        <Typography sx={{ fontSize: 32, padding: 2 }}>
          {messages.actions.importPeople()}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleClick}
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
