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

type Props = {
  org: ZetkinOrganization;
  unsubUrl: string;
};

const UnsubscribePage: FC<Props> = ({ org, unsubUrl }) => {
  const [checked, setChecked] = useState(false);
  const messages = useMessages(messageIds);

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
          <Msg id={messageIds.unsubscribePage.h} values={{ org: org.title }} />
        </Typography>
        <Typography>
          <Msg id={messageIds.unsubscribePage.info} />
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
