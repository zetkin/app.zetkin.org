import { FC } from 'react';
import { Box } from '@mui/material';
import { MarkEmailUnreadOutlined } from '@mui/icons-material';

import ZUISection from 'zui/components/ZUISection';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messagesIds';
import useIsMobile from 'utils/hooks/useIsMobile';
import AccountFooter from './AccountFooter';
import ZUILogo from 'zui/ZUILogo';
import ZUIText from 'zui/components/ZUIText';
import ZUIButton from 'zui/components/ZUIButton';

type CheckEmailSectionProps = {
  email: string;
  onBack: () => void;
};

const CheckEmailSection: FC<CheckEmailSectionProps> = ({ email, onBack }) => {
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
              <ZUIText color="secondary" variant="headingLg">
                <Msg id={messageIds.lostPassword.checkEmail} />
              </ZUIText>
              <ZUIText color="secondary" variant="bodyMdRegular">
                <Msg
                  id={messageIds.lostPassword.descriptionCheck}
                  values={{ email }}
                />
              </ZUIText>
              <ZUIButton
                fullWidth
                label={messages.lostPassword.actions.sendLink()}
                onClick={() => onBack()}
                variant="primary"
              />
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
      title={messages.lostPassword.title()}
    />
  );
};

export default CheckEmailSection;
