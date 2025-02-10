'use client';

import { FC } from 'react';
import { Box, Typography } from '@mui/material';

import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';
import { ZetkinOrganization } from 'utils/types/zetkin';

type Props = {
  org: ZetkinOrganization;
};

const JoinFormVerifiedPage: FC<Props> = ({ org }) => {
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
          <Msg id={messageIds.submissionVerifiedPage.h} />
        </Typography>
        <Typography>
          <Msg
            id={messageIds.submissionVerifiedPage.info}
            values={{ org: org.title }}
          />
        </Typography>
      </Box>
    </Box>
  );
};

export default JoinFormVerifiedPage;
