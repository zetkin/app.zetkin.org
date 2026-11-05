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
import { ZetkinUser } from 'utils/types/zetkin';
import ZUIIconLabelRow from 'zui/components/ZUIIconLabelRow';
import { ZUIIconLabelProps } from 'zui/components/ZUIIconLabel';
import {
  detailsCheckboxesKeys,
  detailsFieldKeys,
} from 'features/manage/utils/fieldKeys';
import EditDetailsButton, {
  languageOptions,
} from 'features/manage/components/EditUserDetailsButton';
import { SupportedLanguage } from 'core/i18n/languages';

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
  fieldKey,
  label,
  value,
}: {
  fieldKey: keyof ZetkinUser;
  label: string;
  value?: string | null;
}) => {
  const messages = useMessages(messageIds);

  const emptyFieldFallback =
    fieldKey === 'lang' ? messages.users.details.autoLanguage() : '–';
  const resolvedValue =
    value && fieldKey === 'lang' && languageOptions[value as SupportedLanguage]
      ? languageOptions[value as SupportedLanguage]
      : value;

  return (
    <Box display="flex" flexDirection="column" mt="0.5rem">
      <ZUIText variant="bodyMdRegular">
        {resolvedValue || emptyFieldFallback}
      </ZUIText>
      <ZUILabel>{label}</ZUILabel>
      <ZUIDivider />
    </Box>
  );
};

const ManageUsersPage: FC<{ userId: number }> = ({ userId }) => {
  const messages = useMessages(messageIds);

  const user = useUser(userId);

  const detailsRows = useMemo(
    () =>
      detailsFieldKeys.map((key) => ({
        fieldKey: key,
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
        renderRightHeaderContent={() => <EditDetailsButton user={user} />}
        title={messages.users.details.title()}
      />
    </Box>
  );
};

export default ManageUsersPage;
