import React, { useMemo } from 'react';

import useMessages from 'core/i18n/useMessages';
import messageIds from '../l10n/messageIds';
import ZUIURLCard from 'zui/components/ZUIURLCard';
import useCampaign from 'features/campaigns/hooks/useCampaign';

interface SurveyURLCardProps {
  isOpen: boolean;
  orgId: number;
  campId: number;
}

const CampaignURLCard = ({ isOpen, orgId, campId }: SurveyURLCardProps) => {
  const campaign = useCampaign(orgId, campId);
  const messages = useMessages(messageIds);

  const campaignUrl = useMemo(
    () =>
      campaign.campaignFuture.data
        ? `${location.protocol}//${location.host}/o/${campaign.campaignFuture.data.organization.id}/projects/${campId}`
        : '',
    [campaign.campaignFuture.data, campId]
  );

  return (
    <ZUIURLCard
      absoluteUrl={campaignUrl}
      isOpen={isOpen}
      messages={messages.urlCard}
      relativeUrl={`/o/${orgId}/projects/${campId}`}
    />
  );
};

export default CampaignURLCard;
