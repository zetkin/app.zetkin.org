import React, { useMemo } from 'react';

import useMessages from 'core/i18n/useMessages';
import messageIds from '../l10n/messageIds';
import useSurvey from '../hooks/useSurvey';
import ZUIURLCard from 'zui/components/ZUIURLCard';

interface SurveyURLCardProps {
  isOpen: boolean;
  orgId: string;
  surveyId: string;
}

const SurveyURLCard = ({ isOpen, orgId, surveyId }: SurveyURLCardProps) => {
  const survey = useSurvey(parseInt(orgId), parseInt(surveyId));
  const messages = useMessages(messageIds);

  const surveyUrl = useMemo(
    () =>
      survey.data
        ? `${location.protocol}//${location.host}/o/${survey.data.organization.id}/surveys/${surveyId}`
        : '',
    [survey.data, surveyId]
  );

  return (
    <ZUIURLCard
      absoluteUrl={surveyUrl}
      isOpen={isOpen}
      messages={messages.urlCard}
      relativeUrl={`/o/${orgId}/surveys/${surveyId}`}
    />
  );
};

export default SurveyURLCard;
