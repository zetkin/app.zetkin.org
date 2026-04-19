import React, { FC } from 'react';
import { GroupWorkOutlined } from '@mui/icons-material';

import { ZetkinAreaAssignment } from 'features/areaAssignments/types';
import useOrganization from 'features/organizations/hooks/useOrganization';
import useProject from 'features/projects/hooks/useProject';
import MyActivityListItem from 'features/my/components/MyActivityListItem';
import ZUIButton from 'zui/components/ZUIButton';
import { useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';

type Props = {
  assignment: ZetkinAreaAssignment;
  href?: string;
};

const AreaAssignmentListItem: FC<Props> = ({ assignment, href }) => {
  const project = useProject(assignment.organization_id, assignment.project_id);
  const organization = useOrganization(assignment.organization_id);
  const messages = useMessages(messageIds);

  return (
    <MyActivityListItem
      actions={[
        <ZUIButton
          key="mainAction"
          href={href}
          label={messages.activityList.actions.areaAssignment()}
          size="large"
          variant="secondary"
        />,
      ]}
      info={[
        {
          Icon: GroupWorkOutlined,
          labels: [
            project.projectFuture.data && {
              href: `/o/${project.projectFuture.data.organization.id}/projects/${project.projectFuture.data.id}`,
              text: project.projectFuture.data.title,
            },
            organization.data && {
              href: `/o/${organization.data.id}`,
              text: organization.data.title,
            },
          ].filter((label) => !!label),
        },
      ]}
      title={assignment.title || messages.defaultTitles.areaAssignment()}
    />
  );
};

export default AreaAssignmentListItem;
