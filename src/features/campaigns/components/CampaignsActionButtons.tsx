import React from 'react';
import { Box, Button } from '@mui/material';

import { Msg, useMessages } from 'core/i18n';

import messageIds from '../l10n/messageIds';
import useCreateCampaign from '../hooks/useCreateCampaign';
import { useNumericRouteParams } from 'core/hooks';

const CampaignActionButtons: React.FunctionComponent = () => {
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();
  const createCampaign = useCreateCampaign(orgId);

  return (
    <Box display="flex">
      <Box mr={1}>
        <Button
          color="primary"
          onClick={() =>
            createCampaign({
              title: messages.form.createCampaign.newCampaign(),
            })
          }
          variant="contained"
        >
          <Msg id={messageIds.all.create} />
        </Button>
      </Box>
    </Box>
  );
};

export default CampaignActionButtons;
