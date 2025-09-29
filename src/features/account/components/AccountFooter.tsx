import { Box } from '@mui/material';

import ZUIDivider from 'zui/components/ZUIDivider';
import ZUILink from 'zui/components/ZUILink';
import ZUIText from 'zui/components/ZUIText';
import { useMessages } from 'core/i18n';
import messageIds from '../l10n/messagesIds';

const AccountFooter = () => {
  const messages = useMessages(messageIds);
  return (
    <>
      <ZUIDivider />
      <Box alignItems="center" display="flex" justifyContent="space-between">
        <ZUIText>
          <ZUILink
            href={'https://zetkin.org/privacy'}
            openInNewTab
            text={messages.lostPassword.footer.readPolicy()}
          />
        </ZUIText>
        <ZUIText>
          <ZUILink
            href={'https://zetkin.org/'}
            openInNewTab
            text="Zetkin.org"
          />
        </ZUIText>
      </Box>
    </>
  );
};
export default AccountFooter;
