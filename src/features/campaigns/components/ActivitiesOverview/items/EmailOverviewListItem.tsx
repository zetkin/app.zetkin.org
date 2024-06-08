import { FC } from 'react';

import dayjs from 'dayjs';
import { EmailActivity } from 'features/campaigns/types';
import messageIds from 'features/campaigns/l10n/messageIds';
import { Msg } from 'core/i18n';
import OverviewListItem from './OverviewListItem';
import useEmailStats from 'features/emails/hooks/useEmailStats';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
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
  const { numTargetMatches, lockedReadyTargets } = useEmailStats(
    email.organization.id,
    email.id
  );

  function getSubtitle(published: string | null) {
    if (published === null) {
      return undefined;
    }
    const now = new Date()
    const publishedDate = dayjs(published);
    const id = publishedDate.isBefore(now) ?
      messageIds.activitiesOverview.subtitles.sentEarlier :
      messageIds.activitiesOverview.subtitles.sentLater;
    return (<Msg
      id={id}
      values={{
        relative: <ZUIRelativeTime datetime={publishedDate.toISOString()} />,
      }}
    />
    );

  }

  return (
    <OverviewListItem
      endDate={activity.visibleUntil}
      endNumber={email.locked ? lockedReadyTargets ?? 0 : numTargetMatches}
      focusDate={focusDate}
      href={`/organize/${email.organization.id}/projects/${
        email.campaign?.id ?? 'standalone'
      }/emails/${email.id}`}
      PrimaryIcon={EmailOutlined}
      SecondaryIcon={Person}
      startDate={activity.visibleFrom}
      subtitle={getSubtitle(activity.data.published)}
      title={email.title || ''}
    />
  );
};

export default EmailOverviewListItem;
