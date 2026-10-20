import { Box } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { FC, useContext, useEffect, useState } from 'react';
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
import ZUISnackbarContext from 'zui/ZUISnackbarContext';

interface PeopleActionButtonProps {
  folderId: number | null;
  orgId: number;
}

const PeopleActionButton: FC<PeopleActionButtonProps> = ({
  folderId,
  orgId,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const joinFormMessages = useMessages(joinFormMessageIds);
  const messages = useMessages(messageIds);
  const zuiMessages = useMessages(zuiMessageIds);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [createPersonOpen, setCreatePersonOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);
  const { showSnackbar } = useContext(ZUISnackbarContext);

  useEffect(() => {
    if (pendingRoute && pendingRoute === pathname) {
      setIsLoading(false);
      setPendingRoute(null);
    }
  }, [pathname, pendingRoute]);

  const createAndNavigate = async (
    create: () => Promise<unknown>,
    route?: string
  ) => {
    setIsLoading(true);
    try {
      await create();
      if (route) {
        setPendingRoute(route);
        router.push(route);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setPendingRoute(null);
      setIsLoading(false);
      showSnackbar('error', messages.actions.createError());
    }
  };

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
            onClick: async () => {
              setIsLoading(true);
              try {
                await createView(folderId || undefined);
              } catch (error) {
                setIsLoading(false);
                showSnackbar('error', messages.actions.createError());
              }
            },
          },
          {
            icon: <FolderOutlined />,
            label: messages.actions.createFolder(),
            onClick: async () => {
              createAndNavigate(
                () =>
                  createFolder(
                    messages.newFolderTitle(),
                    folderId || undefined
                  ),
                !pathname?.includes('folders')
                  ? `/organize/${orgId}/people`
                  : undefined
              );
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
            onClick: () =>
              createAndNavigate(
                () =>
                  createForm({
                    fields: ['first_name', 'last_name', 'email'],
                    requires_email_verification: true,
                    title: joinFormMessages.defaultTitle(),
                  }),
                `/organize/${orgId}/people/joinforms`
              ),
          },
        ]}
        label={
          isLoading ? messages.actions.creating() : messages.actions.create()
        }
        loading={isLoading}
        loadingVariant="persistent"
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
