'use client';

import { Box, Link, Skeleton, Typography } from '@mui/material';
import { FC, useContext, useMemo, useRef, useState } from 'react';
import {
  AddModerator,
  Check,
  Close,
  LinkOff,
  Person,
} from '@mui/icons-material';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';

import useUser from 'features/manage/hooks/useUser';
import { useMessages } from 'core/i18n';
import messageIds from 'features/manage/l10n/messageIds';
import ZUIAlert from 'zui/components/ZUIAlert';
import ZUIText from 'zui/components/ZUIText';
import ZUISection from 'zui/components/ZUISection';
import ZUILabel from 'zui/components/ZUILabel';
import ZUIDivider from 'zui/components/ZUIDivider';
import { ZetkinMembership, ZetkinRole, ZetkinUser } from 'utils/types/zetkin';
import ZUIIconLabelRow from 'zui/components/ZUIIconLabelRow';
import ZUIIconLabel, { ZUIIconLabelProps } from 'zui/components/ZUIIconLabel';
import {
  detailsCheckboxesKeys,
  detailsFieldKeys,
} from 'features/manage/utils/fieldKeys';
import EditDetailsButton, {
  languageOptions,
} from 'features/manage/components/EditUserDetailsButton';
import { SupportedLanguage } from 'core/i18n/languages';
import useUserMemberships from 'features/manage/hooks/useUserMemberships';
import ZUIOrgAvatar from 'zui/components/ZUIOrgAvatar';
import ZUIEllipsisMenu, { MenuItem } from 'zui/ZUIEllipsisMenu';
import { ConfirmationDialogContext } from 'features/manage/components/ConfirmationDialogContext';
import useUserMembershipActions from 'features/manage/hooks/useUserMembershipActions';
import ZUISelect from 'zui/components/ZUISelect';

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

const RoleSelect = ({
  initialRole,
  onChange,
}: {
  initialRole: ZetkinRole;
  onChange: (role: ZetkinRole) => void;
}) => {
  const messages = useMessages(messageIds);
  const [role, setRole] = useState<Exclude<ZetkinRole, null> | 'none'>(
    initialRole ?? 'none'
  );

  return (
    <ZUISelect
      items={[
        { label: messages.users.orgs.roles.admin(), value: 'admin' },
        { label: messages.users.orgs.roles.organizer(), value: 'organizer' },
        { label: messages.users.orgs.roles.noRole(), value: 'none' },
      ]}
      label={messages.users.orgs.editRole.roleToUpdate()}
      onChange={(newRole) => {
        if (newRole === 'none') {
          setRole(newRole);
          onChange(null);
        } else if (newRole === 'admin' || newRole === 'organizer') {
          setRole(newRole);
          onChange(newRole);
        }
      }}
      selectedOption={role}
    />
  );
};

const UserOrganizationRow = ({
  membership,
  userId,
}: {
  membership: ZetkinMembership;
  userId: number;
}) => {
  const messages = useMessages(messageIds);
  const { push } = useRouter();
  const { openConfirmationDialog } = useContext(ConfirmationDialogContext);
  const { disconnectFromOrg, updateUserRole } =
    useUserMembershipActions(userId);

  const targetRoleRef = useRef<ZetkinRole>(null);

  const ellipsisItems: MenuItem[] = useMemo(
    () => [
      {
        label: (
          <ZUIIconLabel
            icon={Person}
            label={messages.users.orgs.goToProfile()}
          />
        ),
        onSelect: () => {
          push(
            `/organize/${membership.organization.id}/people/${membership.profile.id}`
          );
        },
      },
      {
        label: (
          <ZUIIconLabel
            icon={AddModerator}
            label={messages.users.orgs.editRole.actionButton()}
          />
        ),
        onSelect: () => {
          openConfirmationDialog({
            content: () => (
              <Box>
                <RoleSelect
                  initialRole={membership.role as ZetkinRole}
                  onChange={(role) => {
                    targetRoleRef.current = role;
                  }}
                />
              </Box>
            ),
            errorMessage: messages.users.orgs.editRole.failed(),
            submit: () =>
              updateUserRole(
                membership.organization.id,
                membership.profile.id,
                targetRoleRef.current
              ),
            successMessage: messages.users.orgs.editRole.success(),
            title: messages.users.orgs.editRole.actionButton(),
            type: 'save',
          });
        },
      },
      {
        label: (
          <ZUIIconLabel
            icon={LinkOff}
            label={messages.users.orgs.disconnect.actionButton()}
          />
        ),
        onSelect: () => {
          openConfirmationDialog({
            content: () => (
              <ZUIText variant="bodyMdRegular">
                {messages.users.orgs.disconnect.modalDescription()}
              </ZUIText>
            ),
            errorMessage: messages.users.orgs.disconnect.failed(),
            submit: () =>
              disconnectFromOrg(
                membership.organization.id,
                membership.profile.id
              ),
            successMessage: messages.users.orgs.disconnect.success(),
            title: messages.users.orgs.disconnect.actionButton(),
            type: 'save',
          });
        },
      },
    ],
    [
      disconnectFromOrg,
      membership.organization.id,
      membership.profile.id,
      membership.role,
      messages.users.orgs,
      openConfirmationDialog,
      push,
      updateUserRole,
    ]
  );

  return (
    <Box
      alignItems="center"
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
    >
      <Box alignItems="center" display="flex" flexDirection="row" gap="0.5rem">
        <Link
          key={membership.organization.id}
          alignItems="center"
          component={NextLink}
          display="flex"
          flexDirection="row"
          gap="0.5rem"
          href={`/organize/${membership.organization.id}`}
          sx={{
            '&:hover': {
              textDecoration: 'underline',
            },
            textDecoration: 'none',
          }}
        >
          <ZUIOrgAvatar
            orgId={membership.organization.id}
            title={membership.organization.title}
          />
          <ZUIText>{membership.organization.title}</ZUIText>
        </Link>
        {membership.role && (
          <Box
            sx={(theme) => ({
              borderColor:
                membership.role === 'admin'
                  ? theme.palette.primary.main
                  : theme.palette.secondary.main,
              borderRadius: '1rem',
              borderStyle: 'solid',
              borderWidth: '0.1rem',
              display: 'inline-flex',
              overflow: 'hidden',
              padding: '0.1rem 0.5rem',
            })}
          >
            <Typography variant="bodySmRegular">
              {membership.inherited
                ? messages.users.orgs.roles.inheritedBadge({
                    role: messages.users.orgs.roles[
                      membership.role as 'admin' | 'organizer'
                    ](),
                  })
                : messages.users.orgs.roles[
                    membership.role as 'admin' | 'organizer'
                  ]()}
            </Typography>
          </Box>
        )}
      </Box>
      <ZUIEllipsisMenu items={ellipsisItems} />
    </Box>
  );
};

const ManageUsersPage: FC<{ userId: number }> = ({ userId }) => {
  const messages = useMessages(messageIds);

  const user = useUser(userId);
  const memberships = useUserMemberships(userId);

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
    <Box display="flex" flexDirection="row" flexWrap="wrap" gap={'1rem'}>
      <Box flex={1} minWidth="26rem">
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
      <Box flex={1} minWidth="26rem">
        <ZUISection
          renderContent={() => (
            <Box display="flex" flexDirection="column" gap="0.5rem">
              {memberships.map((mem) => (
                <UserOrganizationRow
                  key={mem.organization.id}
                  membership={mem}
                  userId={userId}
                />
              ))}
              {memberships.length === 0 && (
                <ZUIText>{messages.users.orgs.noneConnected()}</ZUIText>
              )}
            </Box>
          )}
          title={messages.users.orgs.title()}
        />
      </Box>
    </Box>
  );
};

export default ManageUsersPage;
