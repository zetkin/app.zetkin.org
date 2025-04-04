import { Box, Typography } from '@mui/material';
import { FC } from 'react';

import { Msg } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import useOrganization from '../hooks/useOrganization';

type Props = { orgId: number };

const NoEventsBlurb: FC<Props> = ({ orgId }) => {
  const org = useOrganization(orgId);

  return (
    <Box
      sx={(theme) => ({
        alignItems: 'center',
        bgcolor: theme.palette.grey[200],
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        my: 4,
        p: 2,
      })}
    >
      <Typography variant="h5">
        <Msg id={messageIds.noEventsBlurb.headline} />
      </Typography>
      {!!org.data && (
        <Typography variant="body2">
          <Msg
            id={messageIds.noEventsBlurb.description}
            values={{ org: org.data.title }}
          />
        </Typography>
      )}
    </Box>
  );
};

export default NoEventsBlurb;
