'use client';

import { Box } from '@mui/material';
import {
  FC,
  MouseEvent,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { Key } from '@mui/icons-material';

import { BreadcrumbTreeItem } from 'zui/components/ZUIBreadcrumbs';
import ZUIHeader from 'zui/components/ZUIHeader';
import { ZUIPersonAvatarProps } from 'zui/components/ZUIPersonAvatar';
import { ZetkinUser } from 'utils/types/zetkin';
import messageIds from 'features/manage/l10n/messageIds';
import { useMessages } from 'core/i18n';
import { WithRequired } from 'utils/types';
import { MenuItem as MenuItemType } from 'zui/components/ZUIMenu';
import useUserActions from 'features/manage/hooks/useUserActions';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import ZUIModal from 'zui/components/ZUIModal';
import ZUISwitch from 'zui/components/ZUISwitch';
import ZUIButton from 'zui/components/ZUIButton';

type Props = {
  children: ReactNode;
  pathname: string;
  title: string;
  visitedUser?: ZetkinUser;
};

const ManageUsersLayout: FC<Props> = ({
  visitedUser,
  children,
  title,
  pathname,
}) => {
  const messages = useMessages(messageIds);
  const { showSnackbar } = useContext(ZUISnackbarContext);

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

  const { sendPasswordReset } = useUserActions(visitedUser?.id);

  const [passwordResetModalOpen, setPasswordResetModalOpen] = useState(false);
  const [
    resetEmailVerificationWithPasswordReset,
    setResetEmailVerificationWithPasswordReset,
  ] = useState(false);
  const [sendingPasswordReset, setSendingPasswordReset] = useState(false);

  const ellipsisMenuItems: WithRequired<MenuItemType, 'startIcon'>[] =
    useMemo(() => {
      if (!visitedUser) {
        return [];
      }
      return [
        {
          label: messages.users.passwordReset.actionButton(),
          onClick: () => setPasswordResetModalOpen(true),
          startIcon: Key,
        },
      ];
    }, [messages.users.passwordReset, visitedUser]);

  const avatar: Omit<ZUIPersonAvatarProps, 'variant' | 'size'> | undefined =
    useMemo(
      () =>
        visitedUser && {
          firstName: visitedUser.first_name,
          id: visitedUser.id,
          isUser: true,
          lastName: visitedUser.last_name,
        },
      [visitedUser]
    );

  const onPasswordResetClick = useCallback(
    async (e: MouseEvent) => {
      e.preventDefault();
      if (!visitedUser) {
        return;
      }

      try {
        setSendingPasswordReset(true);
        await sendPasswordReset(resetEmailVerificationWithPasswordReset);
        showSnackbar('success', messages.users.passwordReset.resetSuccess());
      } catch (err) {
        showSnackbar('error', messages.users.passwordReset.failed());
      }

      setPasswordResetModalOpen(false);
      setSendingPasswordReset(false);
    },
    [
      messages.users.passwordReset,
      resetEmailVerificationWithPasswordReset,
      sendPasswordReset,
      showSnackbar,
      visitedUser,
    ]
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="1rem"
      overflow="hidden"
      p="1rem"
    >
      <ZUIHeader
        actionButtonLabel={messages.users.orgs.add.button()}
        avatar={avatar}
        breadcrumbs={showBreadcrums ? breadcrumbs : undefined}
        ellipsisMenuItems={ellipsisMenuItems}
        title={title}
      />
      <ZUIModal
        keepMounted={true}
        onClose={() => {
          setPasswordResetModalOpen(false);
          setResetEmailVerificationWithPasswordReset(false);
        }}
        open={passwordResetModalOpen}
        size={'medium'}
        title={messages.users.passwordReset.modalTitle()}
      >
        <ZUISwitch
          checked={resetEmailVerificationWithPasswordReset}
          label={messages.users.passwordReset.alsoResetEmailVerification()}
          onChange={setResetEmailVerificationWithPasswordReset}
        />

        <Box
          display="flex"
          flexDirection="row"
          gap="0.5rem"
          justifyContent="flex-end"
        >
          <ZUIButton
            label={messages.users.details.edit.cancel()}
            onClick={() => {
              setPasswordResetModalOpen(false);
            }}
            variant="secondary"
          />
          <ZUIButton
            actionType="submit"
            isLoading={sendingPasswordReset}
            label={messages.users.details.edit.save()}
            onClick={onPasswordResetClick}
            variant="primary"
          />
        </Box>
      </ZUIModal>
      {children}
    </Box>
  );
};

export default ManageUsersLayout;
