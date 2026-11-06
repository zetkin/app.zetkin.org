'use client';

import { Box } from '@mui/material';
import {
  FC,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Key, Mail } from '@mui/icons-material';

import { BreadcrumbTreeItem } from 'zui/components/ZUIBreadcrumbs';
import ZUIHeader from 'zui/components/ZUIHeader';
import { ZUIPersonAvatarProps } from 'zui/components/ZUIPersonAvatar';
import { ZetkinUser } from 'utils/types/zetkin';
import messageIds from 'features/manage/l10n/messageIds';
import { useMessages } from 'core/i18n';
import { WithRequired } from 'utils/types';
import { MenuItem as MenuItemType } from 'zui/components/ZUIMenu';
import useUserActions from 'features/manage/hooks/useUserActions';
import ZUISwitch from 'zui/components/ZUISwitch';
import { ConfirmationDialogContext } from 'features/manage/components/ConfirmationDialogContext';
import useUserMembershipActions from 'features/manage/hooks/useUserMembershipActions';
import OrganizationSelect from 'features/manage/components/OrganizationSelect';

type Props = {
  children: ReactNode;
  pathname: string;
  title: string;
  visitedUser: ZetkinUser;
};

const ManageUserLayout: FC<Props> = ({
  visitedUser,
  children,
  title,
  pathname,
}) => {
  const messages = useMessages(messageIds);
  const { openConfirmationDialog } = useContext(ConfirmationDialogContext);

  const { connectToOrg } = useUserMembershipActions(visitedUser.id);

  const pathParts = useMemo(
    () => pathname.split('/').filter(Boolean),
    [pathname]
  );

  const breadcrumbs = useMemo(
    () =>
      pathParts.reduceRight<BreadcrumbTreeItem[]>(
        (children, segment, index) => [
          {
            children,
            href: `/${pathParts.slice(0, index + 1).join('/')}`,
            title: segment,
          },
        ],
        []
      ),
    [pathParts]
  );

  const showBreadcrums =
    pathParts.length > 1 && (pathParts[1] !== 'users' || pathParts.length > 2);

  const { updateUser, sendVerificationCode, sendPasswordReset } =
    useUserActions(visitedUser);

  const [
    resetEmailVerificationWhenSendingCode,
    setResetEmailVerificationWhenSendingCode,
  ] = useState(true);

  const avatar: Omit<ZUIPersonAvatarProps, 'variant' | 'size'> | undefined =
    useMemo(
      () => ({
        firstName: visitedUser.first_name,
        id: visitedUser.id,
        isUser: true,
        lastName: visitedUser.last_name,
      }),
      [visitedUser]
    );

  const ellipsisMenuItems: WithRequired<MenuItemType, 'startIcon'>[] = useMemo(
    () => [
      {
        label: messages.users.verifyEmail.actionButton(),
        onClick: () => {
          openConfirmationDialog({
            content: () => (
              <ZUISwitch
                checked={resetEmailVerificationWhenSendingCode}
                label={messages.users.verifyEmail.alsoResetEmailVerification()}
                onChange={setResetEmailVerificationWhenSendingCode}
              />
            ),
            errorMessage: messages.users.verifyEmail.failed(),
            submit: async () => {
              if (resetEmailVerificationWhenSendingCode) {
                await updateUser({ email_is_verified: false });
              }
              await sendVerificationCode();
            },
            successMessage: messages.users.verifyEmail.sendSuccess(),
            title: messages.users.verifyEmail.modalTitle(),
            type: 'send',
          });
        },
        startIcon: Mail,
      },
      {
        label: messages.users.passwordReset.actionButton(),
        onClick: () => {
          openConfirmationDialog({
            errorMessage: messages.users.passwordReset.failed(),
            submit: sendPasswordReset,
            successMessage: messages.users.passwordReset.sendSuccess(),
            title: messages.users.passwordReset.modalTitle(),
            type: 'send',
          });
        },
        startIcon: Key,
      },
    ],
    [
      messages.users.passwordReset,
      messages.users.verifyEmail,
      openConfirmationDialog,
      resetEmailVerificationWhenSendingCode,
      sendPasswordReset,
      sendVerificationCode,
      updateUser,
    ]
  );

  const toConnectOrgIdRef = useRef<number | null>(null);

  const onConnectToOrgClick = useCallback(() => {
    toConnectOrgIdRef.current = null;
    openConfirmationDialog({
      content: ({ setSubmitDisabled }) => (
        <OrganizationSelect
          onSelect={(organization) => {
            toConnectOrgIdRef.current = organization?.id ?? null;
          }}
          setSubmitDisabled={setSubmitDisabled}
        />
      ),
      errorMessage: messages.users.orgs.connect.failed(),
      submit: async () => {
        if (toConnectOrgIdRef.current === null) {
          throw new Error('No organization selected');
        }
        await connectToOrg(toConnectOrgIdRef.current);
      },
      successMessage: messages.users.orgs.connect.success(),
      title: messages.users.orgs.connect.modalTitle(),
      type: 'save',
    });
  }, [openConfirmationDialog, messages.users.orgs.connect, connectToOrg]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="1rem"
      height="100%"
      p="1rem"
      sx={{
        overflowX: 'hidden',
        overflowY: 'auto',
      }}
    >
      <ZUIHeader
        actionButtonLabel={messages.users.orgs.connect.actionButton()}
        avatar={avatar}
        breadcrumbs={showBreadcrums ? breadcrumbs : undefined}
        ellipsisMenuItems={ellipsisMenuItems}
        onActionButtonClick={onConnectToOrgClick}
        title={title}
      />
      {children}
    </Box>
  );
};

export default ManageUserLayout;
