import React, { FC } from 'react';
import { GroupWorkOutlined } from '@mui/icons-material';

import { ZetkinVisitAssignment } from 'features/visitassignments/types';
import useOrganization from 'features/organizations/hooks/useOrganization';
import useCampaign from 'features/campaigns/hooks/useCampaign';
import MyActivityListItem from './MyActivityListItem';
import ZUIButton from 'zui/components/ZUIButton';
import { useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';

type Props = {
  assignment: ZetkinVisitAssignment;
  href?: string;
};

const VisitAssignmentListItem: FC<Props> = ({ assignment, href }) => {
  const campaign = useCampaign(
    assignment.organization.id,
    assignment.campaign.id
  );
  const organization = useOrganization(assignment.organization.id);
  const messages = useMessages(messageIds);

  return (
    <MyActivityListItem
      actions={[
        <ZUIButton
          key="mainAction"
          href={href}
          label={messages.activityList.actions.visitAssignment()}
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
      title={assignment.title || messages.defaultTitles.visitAssignment()}
    />
  );
};

export default VisitAssignmentListItem;
