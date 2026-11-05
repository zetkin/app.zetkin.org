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
import { Mail } from '@mui/icons-material';

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
  visitedUser: ZetkinUser;
};

const ManageUserLayout: FC<Props> = ({
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

  const { updateUser, sendVerificationCode } = useUserActions(visitedUser.id);

  const [verificationCodeModalOpen, setVerificationCodeModalOpen] =
    useState(false);
  const [
    resetEmailVerificationWhenSendingCode,
    setResetEmailVerificationWhenSendingCode,
  ] = useState(true);
  const [sendingVerificationCode, setSendingVerificationCode] = useState(false);

  const ellipsisMenuItems: WithRequired<MenuItemType, 'startIcon'>[] = useMemo(
    () => [
      {
        label: messages.users.verifyEmail.actionButton(),
        onClick: () => setVerificationCodeModalOpen(true),
        startIcon: Mail,
      },
    ],
    [messages.users.verifyEmail]
  );

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

  const onSendVerificationCodeClick = useCallback(
    async (e: MouseEvent) => {
      e.preventDefault();
      if (!visitedUser) {
        return;
      }

      try {
        setSendingVerificationCode(true);
        if (resetEmailVerificationWhenSendingCode) {
          await updateUser({ email_is_verified: false });
        }
        await sendVerificationCode();
        showSnackbar('success', messages.users.verifyEmail.sendSuccess());
      } catch (err) {
        showSnackbar('error', messages.users.verifyEmail.failed());
      }

      setVerificationCodeModalOpen(false);
      setSendingVerificationCode(false);
    },
    [
      messages.users.verifyEmail,
      resetEmailVerificationWhenSendingCode,
      sendVerificationCode,
      showSnackbar,
      updateUser,
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
          setVerificationCodeModalOpen(false);
          setResetEmailVerificationWhenSendingCode(false);
        }}
        open={verificationCodeModalOpen}
        size={'medium'}
        title={messages.users.verifyEmail.modalTitle()}
      >
        <Box
          component="form"
          display="flex"
          flexDirection="column"
          gap="1rem"
          width="100%"
        >
          <ZUISwitch
            checked={resetEmailVerificationWhenSendingCode}
            label={messages.users.verifyEmail.alsoResetEmailVerification()}
            onChange={setResetEmailVerificationWhenSendingCode}
          />

          <Box
            display="flex"
            flexDirection="row"
            gap="0.5rem"
            justifyContent="flex-end"
          >
            <ZUIButton
              label={messages.dialog.cancel()}
              onClick={() => {
                setVerificationCodeModalOpen(false);
              }}
              variant="secondary"
            />
            <ZUIButton
              actionType="submit"
              isLoading={sendingVerificationCode}
              label={messages.dialog.save()}
              onClick={onSendVerificationCodeClick}
              variant="primary"
            />
          </Box>
        </Box>
      </ZUIModal>
      {children}
    </Box>
  );
};

export default ManageUserLayout;
