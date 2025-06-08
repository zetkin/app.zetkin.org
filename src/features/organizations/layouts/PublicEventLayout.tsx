'use client';

import { Box } from '@mui/system';
import { FC, PropsWithChildren, Suspense } from 'react';

import { ZetkinOrganization } from 'utils/types/zetkin';
import ZUILink from 'zui/components/ZUILink';
import ZUIText from 'zui/components/ZUIText';
import ZUILogo from 'zui/ZUILogo';
import messageIds from '../l10n/messageIds';
import { useMessages } from 'core/i18n';
import { useEnv } from 'core/hooks';
import { HeaderSection } from '../pages/PublicEventPage';
import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import { ZetkinEventWithStatus } from 'features/home/types';

type Props = PropsWithChildren<{
  eventId: number;
  org: ZetkinOrganization;
}>;

export const PublicEventLayout: FC<Props> = ({ children, eventId, org }) => {
  const messages = useMessages(messageIds);
  const env = useEnv();

  return (
    <>
      <Suspense
        fallback={
          <>
            <HeaderSection
              event={
                {
                  id: eventId,
                  title: messages.eventPage.loading(),
                } as ZetkinEventWithStatus
              }
              org={org}
              user={null}
            />
            <Box
              alignItems="center"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              minHeight="50dvh"
            >
              <ZUILogoLoadingIndicator />
            </Box>
          </>
        }
      >
        {children}
      </Suspense>
      <Box
        alignItems="center"
        component="footer"
        display="flex"
        flexDirection="column"
        mx={1}
        my={2}
        sx={{ opacity: 0.75 }}
      >
        <ZUILogo />
        <ZUIText variant="bodySmRegular">Zetkin</ZUIText>
        <ZUILink
          href={
            env.vars.ZETKIN_PRIVACY_POLICY_LINK ||
            'https://www.zetkin.org/privacy'
          }
          size="small"
          text={messages.home.footer.privacyPolicy()}
        />
      </Box>
    </>
  );
};
export default PublicEventLayout;
