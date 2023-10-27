import { FC, useState } from 'react';
import {
  FolderOutlined,
  InsertDriveFileOutlined,
  UploadFileOutlined,
} from '@mui/icons-material';

import Importer from 'features/import/components/Importer';
import messageIds from '../l10n/messageIds';
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
  const [open, setOpen] = useState(false);
  return (
    <>
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
            onClick: () => {
              setOpen(true);
            },
          },
        ]}
        label={messages.actions.create()}
      />
      <Importer
        activeStep={1}
        onClose={() => setOpen(false)}
        onRestart={() => setOpen(false)}
        onValidate={() => setOpen(false)}
        open={open}
      />
    </>
  );
};

export default PeopleActionButton;
