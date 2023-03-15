import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import { FC, useContext } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import patchCampaign from '../fetching/patchCampaign';
import { useMessages } from 'core/i18n';
import { ZetkinCampaign } from 'utils/types/zetkin';
import ZUIEditTextinPlace from 'zui/ZUIEditTextInPlace';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';

import messageIds from '../l10n/messageIds';

interface EditableCampaignTitleProps {
  campaign: ZetkinCampaign;
}

const EditableCampaignTitle: FC<EditableCampaignTitleProps> = ({
  campaign,
}) => {
  const messages = useMessages(messageIds);
  const queryClient = useQueryClient();
  const { orgId } = useRouter().query;

  const { showSnackbar } = useContext(ZUISnackbarContext);

  const patchCampaignMutation = useMutation(
    patchCampaign(orgId as string, campaign.id)
  );

  const handleEditCampaignTitle = (newTitle: string) => {
    patchCampaignMutation.mutate(
      { title: newTitle },
      {
        onError: () =>
          showSnackbar('error', messages.form.editCampaignTitle.error()),
        onSettled: () => queryClient.invalidateQueries(['campaign']),
        onSuccess: () =>
          showSnackbar('success', messages.form.editCampaignTitle.success()),
      }
    );
  };

  return (
    <Box>
      <ZUIEditTextinPlace
        key={campaign.id}
        onChange={(newTitle) => {
          handleEditCampaignTitle(newTitle);
        }}
        value={campaign?.title}
      />
    </Box>
  );
};

export default EditableCampaignTitle;
