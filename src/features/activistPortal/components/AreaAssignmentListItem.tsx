import React, { FC } from 'react';
import { GroupWorkOutlined } from '@mui/icons-material';

import { ZetkinAreaAssignment } from 'features/areaAssignments/types';
import useOrganization from 'features/organizations/hooks/useOrganization';
import useCampaign from 'features/campaigns/hooks/useCampaign';
import MyActivityListItem from './MyActivityListItem';
import ZUIButton from 'zui/components/ZUIButton';
import { useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';

type Props = {
  assignment: ZetkinAreaAssignment;
  href?: string;
};

const AreaAssignmentListItem: FC<Props> = ({ assignment, href }) => {
  const campaign = useCampaign(
    assignment.organization_id,
    assignment.project_id
  );
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
            campaign.campaignFuture.data?.title,
            organization.data?.title,
          ].filter((label) => !!label) as string[],
        },
      ]}
      title={assignment.title || messages.defaultTitles.areaAssignment()}
    />
  );
};

export default AreaAssignmentListItem;
