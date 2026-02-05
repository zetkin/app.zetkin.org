import { FC } from 'react';
import { Box } from '@mui/material';
import { MarkEmailUnreadOutlined } from '@mui/icons-material';

import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import ZUIText from 'zui/components/ZUIText';
import ZUIButton from 'zui/components/ZUIButton';
import ResponsiveAccountSection from './ResponsiveAccountSection';

type CheckEmailSectionProps = {
  email: string;
  onBack: (email: string) => void;
};

const CheckEmailSection: FC<CheckEmailSectionProps> = ({ email, onBack }) => {
  const messages = useMessages(messageIds);

  return (
    <ResponsiveAccountSection
      renderContent={() => (
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            gap: 2,
            justifyContent: 'center',
          }}
        >
          <MarkEmailUnreadOutlined color="secondary" fontSize="large" />
          <ZUIText color="secondary" variant="headingLg">
            <Msg id={messageIds.lostPassword.checkEmail} />
          </ZUIText>
          <ZUIText color="secondary" variant="bodyMdRegular">
            <Msg
              id={messageIds.lostPassword.descriptionCheck}
              values={{
                email: (
                  <ZUIText color="secondary" variant="bodyMdSemiBold">
                    {email}
                  </ZUIText>
                ),
              }}
            />
          </ZUIText>
          <ZUIButton
            fullWidth
            label={messages.lostPassword.actions.sendLink()}
            onClick={() => onBack(email)}
            variant="secondary"
          />
        </Box>
      )}
      title={messages.lostPassword.title()}
    />
  );
};

export default CheckEmailSection;
