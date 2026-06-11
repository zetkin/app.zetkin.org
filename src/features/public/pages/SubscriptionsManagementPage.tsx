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

        <Box
          sx={{
            columnGap: 1.5,
            display: 'grid',
            gridTemplateColumns: 'auto 1fr auto',
          }}
        >
          {MOCK_SUBSCRIPTIONS.flatMap((subscription, index, all) => {
            const isActive = subscription.state === 'active';
            const isLast = index === all.length - 1;
            return [
              <Box
                key={`icon-${subscription.id}`}
                sx={{ alignSelf: 'start', display: 'flex', py: 1 }}
              >
                <MailOutline
                  sx={(theme) => ({
                    color: isActive
                      ? theme.palette.text.primary
                      : theme.palette.text.secondary,
                    fontSize: '1.5rem',
                  })}
                />
              </Box>,
              <Box key={`name-${subscription.id}`} sx={{ py: 1 }}>
                <ZUIText
                  color={isActive ? 'primary' : 'secondary'}
                  variant="bodyMdRegular"
                >
                  {subscription.name}
                </ZUIText>
              </Box>,
              <Box
                key={`btn-${subscription.id}`}
                sx={{ alignSelf: 'start', py: 1 }}
              >
                <ZUIButton
                  endIcon={NotificationsNone}
                  fullWidth
                  label={isActive ? 'Mute' : 'Allow'}
                  size="small"
                  variant="tertiary"
                />
              </Box>,
              ...(!isLast
                ? [
                    <Box
                      key={`divider-${subscription.id}`}
                      sx={{ gridColumn: '1 / -1' }}
                    >
                      <ZUIDivider />
                    </Box>,
                  ]
                : []),
            ];
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default SubscriptionsManagementPage;
