import React from 'react';
import { useRouter } from 'next/router';
import { Box, Button } from '@mui/material';

import CampaignBrowserModel from '../models/CampaignBrowserModel';
import useModel from 'core/useModel';
import { Msg, useMessages } from 'core/i18n';

import messageIds from '../l10n/messageIds';

const CampaignActionButtons: React.FunctionComponent = () => {
  const messages = useMessages(messageIds);
  const router = useRouter();
  const { orgId } = router.query;
  const model = useModel(
    (env) => new CampaignBrowserModel(env, parseInt(orgId as string))
  );

  // Event Handlers
  const handleCreateCampaign = () => {
    const campaign = {
      title: messages.form.createCampaign.newCampaign(),
    };
    model.createCampaign(campaign);
  };

  return (
    <Box display="flex">
      <Box mr={1}>
        <Button
          color="primary"
          onClick={handleCreateCampaign}
          variant="contained"
        >
          <Msg id={messageIds.all.create} />
        </Button>
      </Box>
    </Box>
  );
};

export default CampaignActionButtons;
