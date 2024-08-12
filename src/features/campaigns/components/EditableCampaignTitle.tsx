import { Box } from '@mui/material';
import { FC } from 'react';

import { ZetkinCampaign } from 'utils/types/zetkin';
import ZUIEditTextinPlace from 'zui/ZUIEditTextInPlace';
import useCampaign from '../hooks/useCampaign';
import { useNumericRouteParams } from 'core/hooks';

interface EditableCampaignTitleProps {
  campaign: ZetkinCampaign;
}

const EditableCampaignTitle: FC<EditableCampaignTitleProps> = ({
  campaign,
}) => {
  const { orgId } = useNumericRouteParams();
  const { updateCampaign } = useCampaign(orgId, campaign.id);

  return (
    <Box>
      <ZUIEditTextinPlace
        key={campaign.id}
        onChange={(newTitle) => {
          updateCampaign({ title: newTitle });
        }}
        value={campaign.title}
      />
    </Box>
  );
};

export default EditableCampaignTitle;
