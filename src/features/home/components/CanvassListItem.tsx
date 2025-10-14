'use client';

import { GroupWorkOutlined } from '@mui/icons-material';
import React, { useMemo } from 'react';

import MyActivityListItem from './MyActivityListItem';
import ZUIButton from 'zui/components/ZUIButton';
import messageIds from '../l10n/messageIds';
import { useMessages } from 'core/i18n';
import { ZetkinAreaAssignment } from 'features/areaAssignments/types';
import useOrganization from 'features/organizations/hooks/useOrganization';
import useCampaign from 'features/campaigns/hooks/useCampaign';

type Props = {
  activity: ZetkinAreaAssignment;
  href?: string;
};

const CanvassListItem: React.FC<Props> = ({ href, activity }) => {
  const messages = useMessages(messageIds);
  const org = useOrganization(activity.organization_id);
  const proj = useCampaign(activity.organization_id, activity.project_id);

  const info = useMemo(
    () => [
      {
        Icon: GroupWorkOutlined,
        labels: [
          proj.campaignFuture.isLoading || proj.campaignFuture.error
            ? null
            : {
                href: `/o/${activity.organization_id}/projects/${activity.project_id}`,
                text: proj.campaignFuture.data
                  ? proj.campaignFuture.data.title
                  : `<${activity.project_id}>`,
              },
          {
            href: `/o/${activity.organization_id}/`,
            text: org.data ? org.data.title : `<${activity.organization_id}>`,
          },
        ].filter((label) => !!label),
      },
    ],
    [proj.campaignFuture, org]
  );

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
      description={activity.instructions}
      href={href}
      info={info}
      title={activity.title || messages.defaultTitles.areaAssignment()}
    />
  );
};

export default CanvassListItem;
