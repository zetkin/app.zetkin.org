import { FC } from 'react';
import { Box } from '@mui/material';
import { MarkEmailUnreadOutlined } from '@mui/icons-material';

import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import ZUIText from 'zui/components/ZUIText';
import ResponsiveAccountSection from './ResponsiveAccountSection';

type RegisterSuccessSectionProps = {
  email: string;
  userName: string;
};

const RegisterSuccessSection: FC<RegisterSuccessSectionProps> = ({
  email,
  userName,
}) => {
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
            mt: 15,
          }}
        >
          <MarkEmailUnreadOutlined color="secondary" fontSize="large" />
          <ZUIText variant="headingLg">
            <Msg id={messageIds.register.welcome} values={{ userName }} />
          </ZUIText>
          <Box sx={{ textAlign: 'center' }}>
            <ZUIText color="secondary" display="inline" variant="bodyMdRegular">
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
      )}
      subtitle={messages.register.description()}
      title={messages.register.title()}
    />
  );
};

export default RegisterSuccessSection;
