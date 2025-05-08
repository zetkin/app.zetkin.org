import { Box } from '@mui/material';
import { FC } from 'react';

import { Msg } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import useOrganization from '../hooks/useOrganization';
import ZUIText from 'zui/components/ZUIText';

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
      <ZUIText variant="headingMd">
        <Msg id={messageIds.noEventsBlurb.headline} />
      </ZUIText>
      {!!org.data && (
        <ZUIText variant="bodySmRegular">
          <Msg
            id={messageIds.noEventsBlurb.description}
            values={{ org: org.data.title }}
          />
        </ZUIText>
      )}
    </Box>
  );
};

export default NoEventsBlurb;
