import { useRouter } from 'next/router';
import { Box, Button } from '@mui/material';
import React, { useContext } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import postCampaign from '../fetching/postCampaign';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import { Msg, useMessages } from 'core/i18n';

import messageIds from '../l10n/messageIds';

const CampaignActionButtons: React.FunctionComponent = () => {
  const messages = useMessages(messageIds);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showSnackbar } = useContext(ZUISnackbarContext);
  const { orgId } = router.query;

  // Mutations
  const postCampaignMutation = useMutation(postCampaign(orgId as string));

  // Event Handlers
  const handleCreateCampaign = () => {
    const campaign = {
      title: messages.form.createCampaign.newCampaign(),
    };
    postCampaignMutation.mutate(campaign, {
      onError: () =>
        showSnackbar('error', messages.form.createCampaign.error()),
      onSettled: () => queryClient.invalidateQueries(['campaign']),
      onSuccess: (data) =>
        router.push(`/organize/${orgId}/campaigns/${data.id}`),
    });
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
