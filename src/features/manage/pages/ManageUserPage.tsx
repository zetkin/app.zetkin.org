'use client';

import { Box, Skeleton } from '@mui/material';
import { FC, useMemo } from 'react';
import { Check, Close } from '@mui/icons-material';

import useUser from 'features/manage/hooks/useUser';
import { useMessages } from 'core/i18n';
import messageIds from 'features/manage/l10n/messageIds';
import ZUIAlert from 'zui/components/ZUIAlert';
import ZUIText from 'zui/components/ZUIText';
import ZUISection from 'zui/components/ZUISection';
import ZUILabel from 'zui/components/ZUILabel';
import ZUIDivider from 'zui/components/ZUIDivider';
import ZUIButton from 'zui/components/ZUIButton';
import { ZetkinUser } from 'utils/types/zetkin';
import ZUIIconLabelRow from 'zui/components/ZUIIconLabelRow';
import { ZUIIconLabelProps } from 'zui/components/ZUIIconLabel';

export const ManageUserSkeleton = () => {
  return (
    <Box display="flex" flexDirection="column" gap="1rem">
      <Skeleton />
    </Box>
  );
};

export const ManageUserError = () => {
  const messages = useMessages(messageIds);

  return (
    <Box display="flex" flexDirection="column" gap="1rem">
      <ZUIAlert severity={'error'} title={messages.users.errorLoadingPage()} />
    </Box>
  );
};

const UserDetailsRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) => {
  return (
    <Box display="flex" flexDirection="column" mt="0.5rem">
      <ZUIText variant="bodyMdRegular">{value || '–'}</ZUIText>
      <ZUILabel>{label}</ZUILabel>
      <ZUIDivider />
    </Box>
  );
};

const detailsFieldKeys: (keyof ZetkinUser &
  keyof typeof messageIds.users.details.fields)[] = [
  'first_name',
  'last_name',
  'username',
  'email',
  'phone',
  'lang',
];

const detailsCheckboxesKeys: (keyof ZetkinUser &
  keyof typeof messageIds.users.details.checkboxes)[] = [
  'is_verified',
  'email_is_verified',
  'phone_is_verified',
];

const ManageUsersPage: FC<{ userId: number }> = ({ userId }) => {
  const messages = useMessages(messageIds);

  const user = useUser(userId);

  const detailsRows = useMemo(
    () =>
      detailsFieldKeys.map((key) => ({
        label: messages.users.details.fields[key](),
        value: user[key],
      })),
    [messages.users.details.fields, user]
  );

  const detailsIconLabels: ZUIIconLabelProps[] = useMemo(
    () =>
      detailsCheckboxesKeys.map((key) => ({
        icon: user[key] ? Check : Close,
        label: messages.users.details.checkboxes[key](),
      })),
    [messages.users.details.checkboxes, user]
  );

  return (
    <Box>
      <ZUISection
        renderContent={() => (
          <Box>
            <ZUIIconLabelRow iconLabels={detailsIconLabels} />
            {detailsRows.map((row) => (
              <UserDetailsRow key={row.label} {...row} />
            ))}
          </Box>
        )}
        renderRightHeaderContent={() => (
          <ZUIButton label={messages.users.details.editButton()} />
        )}
        title={messages.users.details.title()}
      />
    </Box>
  );
};

export default ManageUsersPage;
