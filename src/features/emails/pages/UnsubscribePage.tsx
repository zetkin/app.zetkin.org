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

type PropsBase = {
  unsubUrl: string;
};

type PropsWithSender = PropsBase & {
  senderEmail: string;
  senderName: string;
};

type PropsWithOrg = PropsBase & {
  org: ZetkinOrganization;
};

const isPropsWithSender = (
  props: PropsWithOrg | PropsWithSender
): props is PropsWithSender => {
  return 'senderName' in props;
};

const UnsubscribePage: FC<PropsWithOrg | PropsWithSender> = (props) => {
  const [checked, setChecked] = useState(false);
  const messages = useMessages(messageIds);

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
          {hasSender ? (
            <Msg id={messageIds.unsubscribePage.senderH} />
          ) : (
            <Msg
              id={messageIds.unsubscribePage.h}
              values={{ org: props.org.title }}
            />
          )}
        </Typography>
        {hasSender && (
          <Typography mb={1} variant="h6">
            <Msg
              id={messageIds.unsubscribePage.senderDetails}
              values={{
                senderEmail: props.senderEmail,
                senderName: props.senderName,
              }}
            />
          </Typography>
        )}
        <Typography>
          {hasSender ? (
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
          <Button href={props.unsubUrl} variant="outlined">
            <Msg id={messageIds.unsubscribePage.unsubButton} />
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default UnsubscribePage;
