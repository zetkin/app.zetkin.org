import { FC } from 'react';

import { EmailActivity } from 'features/campaigns/types';
import OverviewListItem from './OverviewListItem';
import useEmailStats from 'features/emails/hooks/useEmailStats';
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
  const { num_target_matches, lockedTargets } = useEmailStats(
    email.organization.id,
    email.id
  );

  return (
    <OverviewListItem
      endDate={activity.visibleUntil}
      endNumber={email.locked ? lockedTargets : num_target_matches}
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
