import { Box } from '@mui/material';
import NextLink from 'next/link';

import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import ZUIText from 'zui/components/ZUIText';
import ZUIButton from 'zui/components/ZUIButton';
import ResponsiveAccountSection from './ResponsiveAccountSection';

const UpdatedPasswordSection = () => {
  const messages = useMessages(messageIds);

  return (
    <ResponsiveAccountSection
      renderContent={() => (
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
            <NextLink href="/login">
              <ZUIButton
                fullWidth
                label={messages.lostPassword.actions.signIn()}
                size="large"
                variant="secondary"
              />
            </NextLink>
          </Box>
        </Box>
      )}
      title={messages.resetPassword.title()}
    />
  );
};

export default UpdatedPasswordSection;
