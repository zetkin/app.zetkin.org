import { FC } from 'react';

import messageIds from 'features/smartSearch/l10n/messageIds';
import UnderlinedMsg from '../../UnderlinedMsg';
import UnderlinedText from '../../UnderlinedText';
import useProject from 'features/projects/hooks/useProject';

const localMessageIds = messageIds.filters.projectParticipation;

interface UnderlinedProjectTitleProps {
  projectId: number;
  orgId: number;
}

const UnderlinedProjectTitle: FC<UnderlinedProjectTitleProps> = ({
  projectId: projectId,
  orgId,
}) => {
  const { projectFuture } = useProject(orgId, projectId);
  const project = projectFuture.data;

  if (!project) {
    return null;
  }

  return (
    <UnderlinedMsg
      id={localMessageIds.projectSelect.project}
      values={{
        project: <UnderlinedText text={project.title} />,
      }}
    />
  );
};

export default UnderlinedProjectTitle;
