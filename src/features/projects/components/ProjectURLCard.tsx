import React, { useMemo } from 'react';

import useMessages from 'core/i18n/useMessages';
import messageIds from '../l10n/messageIds';
import ZUIURLCard from 'zui/components/ZUIURLCard';
import useProject from 'features/projects/hooks/useProject';

interface SurveyURLCardProps {
  isOpen: boolean;
  orgId: number;
  projectId: number;
}

const ProjectURLCard = ({ isOpen, orgId, projectId }: SurveyURLCardProps) => {
  const project = useProject(orgId, projectId);
  const messages = useMessages(messageIds);

  const projectUrl = useMemo(
    () =>
      project.projectFuture.data
        ? `${location.protocol}//${location.host}/o/${project.projectFuture.data.organization.id}/projects/${projectId}`
        : '',
    [project.projectFuture.data, projectId]
  );

  return (
    <ZUIURLCard
      absoluteUrl={projectUrl}
      isOpen={isOpen}
      messages={messages.urlCard}
      relativeUrl={`/o/${orgId}/projects/${projectId}`}
    />
  );
};

export default ProjectURLCard;
