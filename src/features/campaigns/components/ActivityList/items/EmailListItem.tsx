import { FC } from 'react';
import { EmailOutlined, Person } from '@mui/icons-material';

import ActivityListItemWithStats from './ActivityListItemWithStats';
import useEmail from 'features/emails/hooks/useEmail';
import useEmailStats from 'features/emails/hooks/useEmailStats';
import ActivityListItem, { STATUS_COLORS } from './ActivityListItem';
import useEmailState, { EmailState } from 'features/emails/hooks/useEmailState';

interface EmailListItemProps {
  emailId: number;
  orgId: number;
}

const statusColors = {
  [EmailState.UNKNOWN]: STATUS_COLORS.GRAY,
  [EmailState.DRAFT]: STATUS_COLORS.GRAY,
  [EmailState.SCHEDULED]: STATUS_COLORS.BLUE,
  [EmailState.SENT]: STATUS_COLORS.GREEN,
};

const EmailListItem: FC<EmailListItemProps> = ({ orgId, emailId }) => {
  const { data: email } = useEmail(orgId, emailId);
  const state = useEmailState(orgId, emailId);
  const {
    numClicked,
    numTargetMatches,
    numOpened,
    numSent,
    isLoading: statsLoading,
    numLockedTargets,
    numBlocked,
  } = useEmailStats(orgId, emailId);
  const endNumber = numTargetMatches - numBlocked.any ?? 0;

  if (!email) {
    return null;
  }

  const now = new Date();
  const hasBeenSent = email.published && new Date(email.published) < now;

  return hasBeenSent ? (
    <ActivityListItemWithStats
      blueChipValue={numOpened}
      color={statusColors[state]}
      endNumber={numLockedTargets || 0}
      greenChipValue={numClicked}
      href={`/organize/${orgId}/projects/${
        email.campaign?.id ?? 'standalone'
      }/emails/${emailId}`}
      orangeChipValue={numSent}
      PrimaryIcon={EmailOutlined}
      SecondaryIcon={Person}
      statsLoading={statsLoading}
      title={email.title || ''}
    />
  ) : (
    <ActivityListItem
      color={statusColors[state]}
      endNumber={endNumber}
      href={`/organize/${orgId}/projects/${
        email.campaign?.id ?? 'standalone'
      }/emails/${emailId}`}
      PrimaryIcon={EmailOutlined}
      SecondaryIcon={Person}
      title={email.title || ''}
    />
  );
};

export default EmailListItem;
