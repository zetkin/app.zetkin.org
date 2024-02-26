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
    num_clicked,
    num_target_matches,
    num_opened,
    num_sent,
    lockedTargets,
    isLoading: statsLoading,
  } = useEmailStats(orgId, emailId);

  if (!email) {
    return null;
  }

  const now = new Date();
  const hasBeenSent = email.published && new Date(email.published) < now;

  return hasBeenSent ? (
    <ActivityListItemWithStats
      blueChipValue={num_opened}
      color={statusColors[state]}
      endNumber={lockedTargets}
      greenChipValue={num_clicked}
      href={`/organize/${orgId}/projects/${
        email.campaign?.id ?? 'standalone'
      }/emails/${emailId}`}
      orangeChipValue={num_sent}
      PrimaryIcon={EmailOutlined}
      SecondaryIcon={Person}
      statsLoading={statsLoading}
      title={email.title || ''}
    />
  ) : (
    <ActivityListItem
      color={statusColors[state]}
      endNumber={email.locked ? lockedTargets : num_target_matches}
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
