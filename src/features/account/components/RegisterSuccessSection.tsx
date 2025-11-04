import { FC } from 'react';
import { Box } from '@mui/material';
import { MarkEmailUnreadOutlined } from '@mui/icons-material';

import useIsMobile from 'utils/hooks/useIsMobile';
import ZUISection from 'zui/components/ZUISection';
import AccountFooter from '../components/AccountFooter';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messagesIds';
import ZUILogo from 'zui/ZUILogo';
import ZUIText from 'zui/components/ZUIText';

type RegisterSuccessSectionProps = {
  email: string;
  userName: string;
};

const RegisterSuccessSection: FC<RegisterSuccessSectionProps> = ({
  email,
  userName,
}) => {
  const isMobile = useIsMobile();
  const messages = useMessages(messageIds);

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
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                gap: 2,
                justifyContent: 'center',
                mt: 15,
              }}
            >
              <MarkEmailUnreadOutlined color="secondary" fontSize="large" />
              <ZUIText variant="headingLg">
                <Msg id={messageIds.register.welcome} values={{ userName }} />
              </ZUIText>
              <Box sx={{ textAlign: 'center' }}>
                <ZUIText
                  color="secondary"
                  display="inline"
                  variant="bodyMdRegular"
                >
                  <Msg id={messageIds.register.instructions} />
                </ZUIText>
                <ZUIText
                  color="secondary"
                  display="inline"
                  variant="bodyMdSemiBold"
                >
                  {email}
                </ZUIText>
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
      subtitle={messages.register.description()}
      title={messages.register.title()}
    />
  );
};

export default RegisterSuccessSection;
