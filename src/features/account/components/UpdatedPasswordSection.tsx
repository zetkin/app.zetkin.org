import { Box } from '@mui/material';
import NextLink from 'next/link';

import ZUISection from 'zui/components/ZUISection';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messagesIds';
import useIsMobile from 'utils/hooks/useIsMobile';
import AccountFooter from './AccountFooter';
import ZUILogo from 'zui/ZUILogo';
import ZUIText from 'zui/components/ZUIText';
import ZUIButton from 'zui/components/ZUIButton';

const UpdatedPasswordSection = () => {
  const messages = useMessages(messageIds);
  const isMobile = useIsMobile();
  return (
    <ZUISection
      borders={isMobile ? false : true}
      fullHeight
      renderContent={() => {
        return (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <Box
              sx={{
                alignItems: 'left',
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                gap: 2,
                justifyContent: 'center',
              }}
            >
              <ZUIText variant="bodyMdRegular">
                <Msg id={messageIds.resetPassword.descriptionUpdated} />
              </ZUIText>
              <Box
                sx={{
                  width: '100%',
                }}
              >
                <NextLink href={`https://login.zetk.in/`}>
                  <ZUIButton
                    fullWidth
                    label={messages.lostPassword.actions.signIn()}
                    size="large"
                    variant="secondary"
                  />
                </NextLink>
              </Box>
            </Box>
            <Box
              sx={{
                bottom: { md: 'auto', xs: 0 },
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                left: { md: 'auto', xs: 0 },
                mt: { md: 25, xs: 0 },
                position: { md: 'static', xs: 'absolute' },
                px: isMobile ? 2 : 0,
                py: isMobile ? 2 : 0,
                right: { md: 'auto', xs: 0 },
              }}
            >
              <AccountFooter />
            </Box>
          </Box>
        );
      }}
      renderRightHeaderContent={() => {
        return <ZUILogo />;
      }}
      title={messages.resetPassword.title()}
    />
  );
};

export default UpdatedPasswordSection;
