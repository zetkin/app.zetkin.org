'use client';

import { FC } from 'react';
import { Box, Typography } from '@mui/material';

import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';
import { ZetkinOrganization } from 'utils/types/zetkin';

type PropsWithOrg = {
  org: ZetkinOrganization;
};

type PropsWithSender = {
  senderEmail: string;
  senderName: string;
};

const isPropsWithSender = (
  props: PropsWithOrg | PropsWithSender
): props is PropsWithSender => {
  return 'senderName' in props;
};

const UnsubscribedPage: FC<PropsWithOrg | PropsWithSender> = (props) => {
  const hasSender = isPropsWithSender(props);

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100vw',
      }}
    >
      <Box maxWidth={500}>
        <Typography mb={1} variant="h4">
          <Msg id={messageIds.unsubscribedPage.h} />
        </Typography>
        <Typography>
          {hasSender ? (
            <Msg
              id={messageIds.unsubscribedPage.senderInfo}
              values={{
                senderEmail: props.senderEmail,
                senderName: props.senderName,
              }}
            />
          ) : (
            <Msg
              id={messageIds.unsubscribedPage.info}
              values={{ org: props.org.title }}
            />
          )}
        </Typography>
      </Box>
    </Box>
  );
};

export default UnsubscribedPage;
