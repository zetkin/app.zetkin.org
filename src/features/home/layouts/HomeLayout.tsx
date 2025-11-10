'use client';

import { Box } from '@mui/material';
import { FC, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

import { useMessages } from 'core/i18n';
import ZUIPublicFooter from 'zui/components/ZUIPublicFooter';
import ActivistPortalHeader from 'features/organizations/components/ActivistPortlHeader';
import ZUIAlert from 'zui/components/ZUIAlert';
import useUser from 'core/hooks/useUser';
import useLocalStorage from 'zui/hooks/useLocalStorage';
import useMemberships from 'features/organizations/hooks/useMemberships';
import messageIds from '../l10n/messageIds';

type Props = {
  children: ReactNode;
  title?: string;
};

//TODO: Remove this whole alert sometime in the beginning of 2026 maybe?
const NewLandingPageAlert: FC<{ userId: number }> = ({ userId }) => {
  const messages = useMessages(messageIds);
  const [hasSeenNewLandingPageAlert, setHasSeenNewLandingPageAlert] =
    useLocalStorage<boolean>(`${userId}-hasSeenNewLandingPageAlert`, false);

  if (hasSeenNewLandingPageAlert) {
    return null;
  }

  return (
    <ZUIAlert
      description={messages.newLandingPageAlert.description()}
      onClose={() => setHasSeenNewLandingPageAlert(true)}
      severity="info"
      title={messages.newLandingPageAlert.title()}
    />
  );
};

const HomeLayout: FC<Props> = ({ children, title }) => {
  const messages = useMessages(messageIds);
  const user = useUser();
  const memberships = useMemberships().data || [];
  const isOfficial = memberships.find((membership) => membership.role != null);

  const path = usePathname();
  const lastSegment = path?.split('/').pop() ?? 'home';

  return (
    <Box
      sx={{
        marginX: 'auto',
        maxWidth: 960,
      }}
    >
      {isOfficial && user && <NewLandingPageAlert userId={user.id} />}
      <ActivistPortalHeader
        selectedTab={lastSegment}
        tabs={[
          {
            href: `/my/home`,
            label: messages.tabs.home(),
            value: 'home',
          },
          {
            href: `/my/feed`,
            label: messages.tabs.feed(),
            value: 'feed',
          },
          {
            href: `/my/settings`,
            label: messages.tabs.settings(),
            value: 'settings',
          },
        ]}
        title={title || messages.title()}
      />
      <Box minHeight="90dvh">{children}</Box>
      <ZUIPublicFooter />
    </Box>
  );
};

export default HomeLayout;
