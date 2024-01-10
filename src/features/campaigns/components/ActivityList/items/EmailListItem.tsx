import { FC } from 'react';
import { EmailOutlined, Person } from '@mui/icons-material';

import ActivityListItemWithStats from './ActivityListItemWithStats';
import { STATUS_COLORS } from './ActivityListItem';
import useEmail from 'features/emails/hooks/useEmail';
import useEmailTargets from 'features/emails/hooks/useEmailTargets';
import useEmailState, { EmailState } from 'features/emails/hooks/useEmailState';

interface EmailListItemProps {
  emailId: number;
  orgId: number;
}

const EmailListItem: FC<EmailListItemProps> = ({ orgId, emailId }) => {
  const { data: email } = useEmail(orgId, emailId);
  const state = useEmailState(orgId, emailId);
  const { data: targets, isLoading: targetsLoading } = useEmailTargets(
    orgId,
    emailId
  );

  if (!email) {
    return null;
  }

  let color = STATUS_COLORS.GRAY;
  if (state === EmailState.SENT) {
    color = STATUS_COLORS.GREEN;
  } else if (state === EmailState.SCHEDULED) {
    color = STATUS_COLORS.BLUE;
  }

  //TODO: use actual values for these:
  const blueChipValue = 34;
  const greenChipValue = 34;
  const orangeChipValue = 34;

  return (
    <ActivityListItemWithStats
      blueChipValue={blueChipValue}
      color={color}
      endNumber={targets?.allTargets || 0}
      greenChipValue={greenChipValue}
      href={`/organize/${orgId}/projects/${
        email.campaign?.id ?? 'standalone'
      }/emails/${emailId}`}
      orangeChipValue={orangeChipValue}
      PrimaryIcon={EmailOutlined}
      SecondaryIcon={Person}
      statsLoading={targetsLoading}
      title={email.title}
    />
  );
};

export default EmailListItem;
