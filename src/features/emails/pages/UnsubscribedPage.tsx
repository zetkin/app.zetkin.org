'use client';

import { FC } from 'react';
import { Box, Typography } from '@mui/material';

import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';
import { ZetkinOrganization } from 'utils/types/zetkin';

type Props =
  | {
      org: ZetkinOrganization;
      senderEmail?: never;
      senderName?: never;
    }
  | {
      org?: never;
      senderEmail: string;
      senderName: string;
    };

const UnsubscribedPage: FC<Props> = ({ org, senderName, senderEmail }) => {
  const isSender = !!senderName && !!senderEmail;

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
          {isSender ? (
            <Msg
              id={messageIds.unsubscribedPage.senderInfo}
              values={{ senderEmail, senderName }}
            />
          ) : (
            <Msg
              id={messageIds.unsubscribedPage.info}
              values={{ org: org!.title }}
            />
          )}
        </Typography>
      </Box>
    </Box>
  );
};

export default UnsubscribedPage;
