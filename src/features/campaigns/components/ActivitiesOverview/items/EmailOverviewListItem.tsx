import { FC } from 'react';
import { EmailOutlined, Person } from '@mui/icons-material';

import { EmailActivity } from 'features/campaigns/types';
import useEmailStats from 'features/emails/hooks/useEmailStats';
import OverviewListItem, { STATUS_COLORS } from './OverviewListItem';
import { getEmailSubtitle } from '../../../utils/subtitles';

interface EmailOverviewListItemProps {
  activity: EmailActivity;
  focusDate: Date | null;
}

const EmailOverviewListItem: FC<EmailOverviewListItemProps> = ({
  activity,
  focusDate,
}) => {
  const email = activity.data;
  const { numTargetMatches, lockedReadyTargets } = useEmailStats(
    email.organization.id,
    email.id
  );

  function getColor() {
    const now = new Date();

    const sendTime = activity.visibleFrom;

    if (sendTime) {
      if (sendTime > now) {
        return STATUS_COLORS.BLUE;
      } else if (sendTime < now) {
        return STATUS_COLORS.GREEN;
      }
    }

    // Should never happen, because it should not be in the
    // overview if it's not yet scheduled/published.
    return STATUS_COLORS.GRAY;
  }

  return (
    <OverviewListItem
      color={getColor()}
      endDate={activity.visibleUntil}
      endNumber={email.locked ? lockedReadyTargets ?? 0 : numTargetMatches}
      focusDate={focusDate}
      href={`/organize/${email.organization.id}/projects/${
        email.campaign?.id ?? 'standalone'
      }/emails/${email.id}`}
      PrimaryIcon={EmailOutlined}
      SecondaryIcon={Person}
      startDate={activity.visibleFrom}
      subtitle={getEmailSubtitle(activity.data.published)}
      title={email.title || ''}
    />
  );
};

export default EmailOverviewListItem;
