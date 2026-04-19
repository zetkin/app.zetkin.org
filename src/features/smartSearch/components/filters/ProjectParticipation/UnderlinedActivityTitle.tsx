import { FC } from 'react';

import messageIds from 'features/smartSearch/l10n/messageIds';
import UnderlinedMsg from '../../UnderlinedMsg';
import UnderlinedText from '../../UnderlinedText';
import useEventType from 'features/events/hooks/useEventType';

const localMessageIds = messageIds.filters.campaignParticipation;

interface UnderlinedActivityTitleProps {
  activityId: number;
  orgId: number;
}

const UnderlinedActivityTitle: FC<UnderlinedActivityTitleProps> = ({
  activityId,
  orgId,
}) => {
  const type = useEventType(orgId, activityId).data;

  if (!type) {
    return null;
  }

  return (
    <UnderlinedMsg
      id={localMessageIds.activitySelect.activity}
      values={{
        activity: <UnderlinedText text={type.title} />,
      }}
    />
  );
};

export default UnderlinedActivityTitle;
