'use client';

import { FC, useState, useContext } from 'react';
import {
  Avatar,
  Box,
  Chip,
  Fade,
  IconButton,
  List,
  ListItemButton,
} from '@mui/material';
import { Close, Settings } from '@mui/icons-material';
import Link from 'next/link';

import ZUIText from 'zui/components/ZUIText';
import Drawer from 'zui/components/ZUIDrawerModal/Drawer';
import ZUISwitch from 'zui/components/ZUISwitch';
import useUserMemberships from '../hooks/useUserMemberships';
import useFollowOrgMutations from 'features/organizations/hooks/useFollowOrgMutations';
import { ZetkinMembership } from 'utils/types/zetkin';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import { useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import useIncrementalDelay from '../hooks/useIncrementalDelay';

type OrganisationSettingsDrawerProps = {
  membership: ZetkinMembership;
  onClose: () => void;
  open: boolean;
};

const OrganisationSettingsDrawer: FC<OrganisationSettingsDrawerProps> = ({
  membership,
  onClose,
  open,
}) => {
  const messages = useMessages(messageIds);
  const { showSnackbar } = useContext(ZUISnackbarContext);
  const { orgId, orgTitle } = {
    orgId: membership.organization.id,
    orgTitle: membership.organization.title,
  };

  const { followOrg, unfollowOrg } = useFollowOrgMutations(orgId);
  const isFollowing = membership.follow !== false;

  const handleFollowToggle = async (checked: boolean) => {
    try {
      if (checked) {
        await followOrg(membership);
      } else {
        await unfollowOrg();
      }
      showSnackbar('success', messages.myOrganisations.settingsUpdated());
    } catch {
      showSnackbar('error', messages.myOrganisations.settingsError());
    }
  };

  return (
    <Drawer onClose={onClose} open={open}>
      <Box
        sx={{
          backgroundColor: 'white',
          borderTopLeftRadius: { md: '8px', xs: 0 },
          borderTopRightRadius: { md: '8px', xs: 0 },
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          height: { md: '50vh', xs: '50vh' },
          left: { md: '50%', xs: 0 },
          maxHeight: { md: '50vh', xs: '100%' },
          maxWidth: { md: '960px', xs: '100%' },
          overflow: 'hidden',
          position: { md: 'fixed', xs: 'static' },
          transform: { md: 'translateX(-50%)', xs: 'none' },
          width: { md: '960px', xs: '100%' },
        }}
      >
        <Box
          sx={(theme) => ({
            alignItems: 'center',
            borderBottom: `1px solid ${theme.palette.dividers.lighter}`,
            display: 'flex',
            justifyContent: 'space-between',
            px: 2,
            py: 1.5,
          })}
        >
          <Box sx={{ alignItems: 'center', display: 'flex', gap: 2 }}>
            <Avatar
              alt={orgTitle}
              src={`/api/orgs/${orgId}/avatar`}
              sx={{ height: 48, width: 48 }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <ZUIText variant="bodyLgSemiBold">{orgTitle}</ZUIText>
              {membership.role && (
                <ZUIText color="secondary" variant="bodySmRegular">
                  {messages.myOrganisations.role({ role: membership.role })}
                </ZUIText>
              )}
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ flexShrink: 0 }}>
            <Close />
          </IconButton>
        </Box>

        <Box sx={{ overflowY: 'auto', px: 2, py: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box>
              <ZUISwitch
                checked={isFollowing}
                label={messages.myOrganisations.notifications.follow.label()}
                onChange={handleFollowToggle}
              />
              <ZUIText
                color="secondary"
                sx={{ ml: 6, mt: -0.5 }}
                variant="bodySmRegular"
              >
                {messages.myOrganisations.notifications.follow.description()}
              </ZUIText>
            </Box>

            <Box>
              <ZUISwitch
                checked={false}
                disabled
                label={messages.myOrganisations.notifications.email.label()}
                onChange={() => {}}
              />
              <ZUIText
                color="secondary"
                sx={{ ml: 6, mt: -0.5 }}
                variant="bodySmRegular"
              >
                {messages.myOrganisations.notifications.email.description()}
              </ZUIText>
            </Box>

            <Box>
              <ZUISwitch
                checked={false}
                disabled
                label={messages.myOrganisations.notifications.calls.label()}
                onChange={() => {}}
              />
              <ZUIText
                color="secondary"
                sx={{ ml: 6, mt: -0.5 }}
                variant="bodySmRegular"
              >
                {messages.myOrganisations.notifications.calls.description()}
              </ZUIText>
            </Box>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

type OrganisationListItemProps = {
  membership: ZetkinMembership;
  onOpenSettings: () => void;
};

const OrganisationListItem: FC<OrganisationListItemProps> = ({
  membership,
  onOpenSettings,
}) => {
  const messages = useMessages(messageIds);
  const { orgId, orgTitle, role } = {
    orgId: membership.organization.id,
    orgTitle: membership.organization.title,
    role: membership.role,
  };
  const isFollowing = membership.follow !== false;

  return (
    <ListItemButton
      onClick={onOpenSettings}
      sx={(theme) => ({
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
        },
        alignItems: 'center',
        borderBottom: `1px solid ${theme.palette.dividers.lighter}`,
        display: 'flex',
        gap: 2,
        px: 2,
        py: 1.5,
      })}
    >
      <Link
        href={`/o/${orgId}`}
        onClick={(e) => e.stopPropagation()}
        style={{ textDecoration: 'none' }}
      >
        <Avatar
          alt={orgTitle}
          src={`/api/orgs/${orgId}/avatar`}
          sx={{
            '&:hover': { opacity: 0.8, transform: 'scale(1.05)' },
            height: 48,
            transition: 'all 0.2s ease',
            width: 48,
          }}
        />
      </Link>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Link
          href={`/o/${orgId}`}
          onClick={(e) => e.stopPropagation()}
          style={{ textDecoration: 'none' }}
        >
          <ZUIText
            sx={{
              '&:hover': {
                textDecoration: 'underline',
              },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            variant="bodyLgSemiBold"
          >
            {orgTitle}
          </ZUIText>
        </Link>
        {isFollowing && (
          <Box sx={{ mt: 0.5 }}>
            <Chip
              color="primary"
              label={messages.myOrganisations.notifications.follow.label()}
              size="small"
              variant="outlined"
            />
          </Box>
        )}
      </Box>

      <Settings color="action" sx={{ flexShrink: 0 }} />
    </ListItemButton>
  );
};

const MyOrganizations: FC = () => {
  const messages = useMessages(messageIds);
  const memberships = useUserMemberships();
  const nextDelay = useIncrementalDelay();
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);

  const selectedMembership = selectedOrgId
    ? memberships.find((m) => m.organization.id === selectedOrgId) || null
    : null;

  const handleOpenSettings = (orgId: number) => {
    setSelectedOrgId(orgId);
  };

  const handleCloseSettings = () => {
    setSelectedOrgId(null);
  };

  if (memberships.length === 0) {
    return (
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          justifyContent: 'center',
          minHeight: '40vh',
          p: 3,
        }}
      >
        <ZUIText color="secondary" variant="bodyMdRegular">
          {messages.myOrganisations.emptyState()}
        </ZUIText>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 2 }}>
      <List disablePadding>
        {memberships.map((membership) => (
          <Fade
            key={membership.organization.id}
            appear
            in
            mountOnEnter
            style={{ transitionDelay: nextDelay() }}
          >
            <div>
              <OrganisationListItem
                membership={membership}
                onOpenSettings={() =>
                  handleOpenSettings(membership.organization.id)
                }
              />
            </div>
          </Fade>
        ))}
      </List>

      {selectedMembership && (
        <OrganisationSettingsDrawer
          membership={selectedMembership}
          onClose={handleCloseSettings}
          open={!!selectedMembership}
        />
      )}
    </Box>
  );
};

export default MyOrganizations;
