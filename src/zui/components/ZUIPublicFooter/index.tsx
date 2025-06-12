import { Box } from '@mui/material';
import { FC } from 'react';

import ZUILogo from 'zui/ZUILogo';
import ZUIText from '../ZUIText';
import ZUILink from '../ZUILink';
import { useEnv } from 'core/hooks';
import { useMessages } from 'core/i18n';
import messageIds from 'zui/l10n/messageIds';

const ZUIPublicFooter: FC = () => {
  const messages = useMessages(messageIds);
  const env = useEnv();

  return (
    <Box
      alignItems="center"
      component="footer"
      display="flex"
      flexDirection="column"
      mt={2}
      mx={1}
      pb={2}
      sx={{ opacity: 0.75 }}
    >
      <ZUILogo />
      <ZUIText variant="bodySmRegular">Zetkin</ZUIText>
      <ZUILink
        href={
          env.vars.ZETKIN_PRIVACY_POLICY_LINK || messages.privacyPolicyLink()
        }
        openInNewTab
        size="small"
        text={messages.footer.privacyPolicy()}
      />
    </Box>
  );
};

export default ZUIPublicFooter;
