import { FC } from 'react';
import messageIds from 'features/smartSearch/l10n/messageIds';
import UnderlinedMsg from '../../UnderlinedMsg';
import UnderlinedText from '../../UnderlinedText';
import useCampaign from 'features/campaigns/hooks/useCampaign';

const localMessageIds = messageIds.filters.campaignParticipation;

interface UnderlinedCampaignTitleProps {
  campId: number;
  orgId: number;
}

const UnderlinedCampaignTitle: FC<UnderlinedCampaignTitleProps> = ({
  campId,
  orgId,
}) => {
  const { data } = useCampaign(orgId, campId);

  if (!data) {
    return null;
  }

  return (
    <UnderlinedMsg
      id={localMessageIds.campaignSelect.campaign}
      values={{
        campaign: <UnderlinedText text={data.title} />,
      }}
    />
  );
};

export default UnderlinedCampaignTitle;
