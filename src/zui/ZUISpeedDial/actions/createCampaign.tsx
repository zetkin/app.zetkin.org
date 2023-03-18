import { Alert } from '@mui/material';
import { Flag } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from 'react-query';

import CampaignDetailsForm from 'features/campaigns/components/CampaignDetailsForm';
import postCampaign from 'features/campaigns/fetching/postCampaign';

import { ACTIONS } from '../constants';
import { Msg } from 'core/i18n';
import { ActionConfig, DialogContentBaseProps } from './types';

import messageIds from 'zui/l10n/messageIds';

const DialogContent: React.FunctionComponent<DialogContentBaseProps> = ({
  closeDialog,
}) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { orgId } = router.query as { orgId: string };

  const { mutateAsync: sendCampaignRequest, isError } = useMutation(
    postCampaign(orgId)
  );

  const handleFormSubmit = async (data: Record<string, unknown>) => {
    await sendCampaignRequest(data, {
      onSuccess: async (newCampaign) => {
        queryClient.invalidateQueries('campaigns');
        closeDialog();
        // Redirect to campaign page
        router.push(`/organize/${orgId}/projects/${newCampaign.id}`);
      },
    });
  };

  return (
    <>
      {isError && (
        <Alert color="error" data-testid="error-alert">
          <Msg id={messageIds.speedDial.requestError} />
        </Alert>
      )}
      <CampaignDetailsForm onCancel={closeDialog} onSubmit={handleFormSubmit} />
    </>
  );
};

const config = {
  icon: <Flag />,
  key: ACTIONS.CREATE_CAMPAIGN,
  name: 'misc.speedDial.createCampaign',
  urlKey: 'create-campaign',
} as ActionConfig;

export { config, DialogContent };
