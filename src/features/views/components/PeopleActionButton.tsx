import { Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import {
  FolderOutlined,
  FormatListBulleted,
  InsertDriveFileOutlined,
  PersonAdd,
  UploadFileOutlined,
} from '@mui/icons-material';

import ImportDialog from 'features/import/components/ImportDialog';
import joinFormMessageIds from 'features/joinForms/l10n/messageIds';
import messageIds from '../l10n/messageIds';
import useCreateJoinForm from 'features/joinForms/hooks/useCreateJoinForm';
import useCreateView from '../hooks/useCreateView';
import useFolder from '../hooks/useFolder';
import { useMessages } from 'core/i18n';
import ZUIButtonMenu from 'zui/ZUIButtonMenu';
import ZUICreatePerson from 'zui/ZUICreatePerson';
import zuiMessageIds from 'zui/l10n/messageIds';

interface PeopleActionButtonProps {
  folderId: number | null;
  orgId: number;
}

const PeopleActionButton: FC<PeopleActionButtonProps> = ({
  folderId,
  orgId,
}) => {
  const router = useRouter();
  const joinFormMessages = useMessages(joinFormMessageIds);
  const messages = useMessages(messageIds);
  const zuiMessages = useMessages(zuiMessageIds);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [createPersonOpen, setCreatePersonOpen] = useState(false);

  const { createView } = useCreateView(orgId);
  const { createFolder } = useFolder(orgId, folderId);
  const { createForm } = useCreateJoinForm(orgId);

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
          {
            icon: <PersonAdd />,
            label: messages.actions.createPerson(),
            onClick: () => {
              setCreatePersonOpen(true);
            },
          },
          {
            icon: <FormatListBulleted />,
            label: messages.actions.createJoinForm(),
            onClick: async () => {
              router.push(`/organize/${orgId}/people/joinforms`);
              await createForm({
                fields: ['first_name', 'last_name'],
                title: joinFormMessages.defaultTitle(),
              });
            },
          },
        ]}
        label={messages.actions.create()}
      />
      <ImportDialog
        onClose={() => setImportDialogOpen(false)}
        open={importDialogOpen}
      />
      <ZUICreatePerson
        onClose={() => setCreatePersonOpen(false)}
        open={createPersonOpen}
        submitLabel={zuiMessages.createPerson.submitLabel.default()}
        title={zuiMessages.createPerson.title.default()}
      />
    </Box>
  );
};

export default PeopleActionButton;
