import { FC } from 'react';

import { EmailActivity } from 'features/campaigns/types';
import OverviewListItem from './OverviewListItem';
import useEmailTargets from 'features/emails/hooks/useEmailTargets';
import { EmailOutlined, Person } from '@mui/icons-material';

interface EmailOverviewListItemProps {
  activity: EmailActivity;
  focusDate: Date | null;
}

const EmailOverviewListItem: FC<EmailOverviewListItemProps> = ({
  activity,
  focusDate,
}) => {
  const email = activity.data;
  const { data: targets } = useEmailTargets(email.organization.id, email.id);
  return (
    <OverviewListItem
      endDate={activity.visibleUntil}
      endNumber={targets?.allTargets || 0}
      focusDate={focusDate}
      href={`/organize/${email.organization.id}/projects/${
        email.campaign?.id ?? 'standalone'
      }/emails/${email.id}`}
      PrimaryIcon={EmailOutlined}
      SecondaryIcon={Person}
      startDate={activity.visibleFrom}
      title={email.title || ''}
    />
  );
};

export default EmailOverviewListItem;
