import { FC } from 'react';
import { Box, Button } from '@mui/material';
import {
  FolderOutlined,
  InsertDriveFileOutlined,
  UploadFileOutlined,
} from '@mui/icons-material';

import ViewBrowserModel from '../models/ViewBrowserModel';
import { Msg, useMessages } from 'core/i18n';

import messageIds from '../l10n/messageIds';
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
  return (
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
          onClick: () => {},
        },
      ]}
      label={messages.actions.create()}
    />
  );
};

export default PeopleActionButton;
