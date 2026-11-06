'use client';

import { Box } from '@mui/material';
import { FC } from 'react';

import { useMessages } from 'core/i18n';
import messageIds from 'features/manage/l10n/messageIds';
import ZUIText from 'zui/components/ZUIText';
import ZUIButton from 'zui/components/ZUIButton';

const ManageLayoutNotAllowed: FC = () => {
  const messages = useMessages(messageIds);

  return (
    <Box
      alignItems="center"
      display="flex"
      flexDirection="column"
      gap="0.5rem"
      height="100vh"
      justifyContent="center"
      width="100vw"
    >
      <ZUIText variant={'headingLg'}>{messages.noAccess.title()}</ZUIText>
      <ZUIButton
        href="/my"
        label={messages.noAccess.backHomeCta()}
        variant={'primary'}
      />
    </Box>
  );
};

export default ManageLayoutNotAllowed;
