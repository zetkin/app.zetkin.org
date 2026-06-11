'use client';

import { Box } from '@mui/material';
import {
  MailOutline,
  NotificationsNone,
  NotificationsOff,
} from '@mui/icons-material';
import { FC } from 'react';

import { ZetkinOrganization } from 'utils/types/zetkin';
import ZUIButton from 'zui/components/ZUIButton';
import ZUIDivider from 'zui/components/ZUIDivider';
import ZUIOrgAvatar from 'zui/components/ZUIOrgAvatar';
import ZUIText from 'zui/components/ZUIText';

// Placeholder data
type SubscriptionState = 'active' | 'muted';

type EmailSubscription = {
  id: number;
  name: string;
  state: SubscriptionState;
};

const MOCK_EMAIL = 'person@thirdpartyemailprovider.org';

const MOCK_SUBSCRIPTIONS: EmailSubscription[] = [
  { id: 1, name: 'United News - Newsletter', state: 'active' },
  { id: 2, name: 'Pipe up! - Workplace issues monthly', state: 'muted' },
  {
    id: 3,
    name: 'In the pipeline - Legislation being drafted',
    state: 'muted',
  },
  { id: 4, name: 'Action group (private)', state: 'muted' },
  { id: 5, name: 'Board (private)', state: 'muted' },
];

type Props = {
  org: ZetkinOrganization;
};

const SubscriptionsManagementPage: FC<Props> = ({ org }) => {
  return (
    <Box
      sx={{
        alignItems: 'center',
        bgcolor: 'white',
        display: 'flex',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <Box sx={{ maxWidth: 430, p: 3, width: '100%' }}>
        <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 2 }}>
          <ZUIOrgAvatar orgId={org.id} size="small" title={org.title} />
          <ZUIText variant="bodyMdSemiBold">{org.title}</ZUIText>
        </Box>

        <ZUIDivider />

        <Box sx={{ py: 2 }}>
          <ZUIText component="h1" variant="headingMd">
            Channel settings
          </ZUIText>
          <ZUIText color="secondary" variant="bodyMdRegular">
            {MOCK_EMAIL}
          </ZUIText>
        </Box>

        <ZUIDivider />

        <Box
          sx={(theme) => ({
            backgroundColor: theme.palette.swatches.blue[100],
            borderRadius: '0.25rem',
            color: theme.palette.swatches.blue[900],
            my: 2,
            p: 2,
          })}
        >
          <ZUIText color="inherit" variant="bodyMdRegular">
            After you unsubscribe you will no longer receive mass email. You may
            still receive reminders and other email sent specifically to you as
            part of work you do in the organization.
          </ZUIText>
        </Box>

        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            py: 1.5,
          }}
        >
          <ZUIText variant="bodyMdRegular">All emails</ZUIText>
          <ZUIButton
            endIcon={NotificationsOff}
            label="Mute all"
            size="small"
            variant="tertiary"
          />
        </Box>

        <ZUIDivider />

        {MOCK_SUBSCRIPTIONS.map((subscription, index) => {
          const isActive = subscription.state === 'active';
          return (
            <Box key={subscription.id}>
              <Box
                sx={{
                  alignItems: 'flex-start',
                  display: 'flex',
                  gap: 1.5,
                  py: 1.5,
                }}
              >
                <MailOutline
                  sx={(theme) => ({
                    color: isActive
                      ? theme.palette.text.primary
                      : theme.palette.text.secondary,
                    fontSize: '1.5rem',
                  })}
                />
                <ZUIText
                  color={isActive ? 'primary' : 'secondary'}
                  sx={{ flexGrow: 1 }}
                  variant="bodyMdRegular"
                >
                  {subscription.name}
                </ZUIText>
                <ZUIButton
                  endIcon={NotificationsNone}
                  label={isActive ? 'Mute' : 'Allow'}
                  size="small"
                  variant="tertiary"
                />
              </Box>
              {index < MOCK_SUBSCRIPTIONS.length - 1 && <ZUIDivider />}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default SubscriptionsManagementPage;
