'use client';

import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
} from '@mui/material';
import { FC, useState } from 'react';

import messageIds from '../l10n/messageIds';
import { ZetkinOrganization } from 'utils/types/zetkin';
import { Msg, useMessages } from 'core/i18n';

type Props =
  | {
      org: ZetkinOrganization;
      senderEmail?: never;
      senderName?: never;
      unsubUrl: string;
    }
  | {
      org?: never;
      senderEmail: string;
      senderName: string;
      unsubUrl: string;
    };

const UnsubscribePage: FC<Props> = ({
  org,
  unsubUrl,
  senderName,
  senderEmail,
}) => {
  const [checked, setChecked] = useState(false);
  const messages = useMessages(messageIds);

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
          {isSender ? (
            <Msg id={messageIds.unsubscribePage.senderH} />
          ) : (
            <Msg
              id={messageIds.unsubscribePage.h}
              values={{ org: org!.title }}
            />
          )}
        </Typography>
        {isSender && (
          <Typography mb={1} variant="h6">
            <Msg
              id={messageIds.unsubscribePage.senderDetails}
              values={{ senderEmail, senderName }}
            />
          </Typography>
        )}
        <Typography>
          {isSender ? (
            <Msg id={messageIds.unsubscribePage.senderInfo} />
          ) : (
            <Msg id={messageIds.unsubscribePage.info} />
          )}
        </Typography>
        <Box my={2}>
          <FormControlLabel
            control={
              <Checkbox
                name="unsubscribe"
                onChange={(ev) => {
                  setChecked(ev.target.checked);
                }}
              />
            }
            label={messages.unsubscribePage.consent()}
            value="unsubscribe"
          />
        </Box>
        {checked && (
          <Button href={unsubUrl} variant="outlined">
            <Msg id={messageIds.unsubscribePage.unsubButton} />
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default UnsubscribePage;
