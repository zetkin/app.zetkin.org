import { FC, useState } from 'react';
import {
  FolderOutlined,
  InsertDriveFileOutlined,
  UploadFileOutlined,
} from '@mui/icons-material';

import Importer from 'features/import/components/Importer';
import messageIds from '../l10n/messageIds';
import useCreateView from '../hooks/useCreateView';
import useFolder from '../hooks/useFolder';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import ZUIButtonMenu from 'zui/ZUIButtonMenu';

interface PeopleActionButtonProps {
  folderId: number | null;
}

const PeopleActionButton: FC<PeopleActionButtonProps> = ({ folderId }) => {
  const { orgId } = useNumericRouteParams();
  const messages = useMessages(messageIds);
  const [open, setOpen] = useState(false);

  const createView = useCreateView(orgId);
  const { createFolder } = useFolder(orgId);

  return (
    <>
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
