import { FC } from 'react';

import messageIds from 'features/smartSearch/l10n/messageIds';
import UnderlinedMsg from '../../UnderlinedMsg';
import UnderlinedText from '../../UnderlinedText';
import useEventLocation from 'features/events/hooks/useEventLocation';

const localMessageIds = messageIds.filters.campaignParticipation;

interface UnderlinedLocationTitleProps {
  locationId: number;
  orgId: number;
}

const UnderlinedLocationTitle: FC<UnderlinedLocationTitleProps> = ({
  locationId,
  orgId,
}) => {
  const location = useEventLocation(orgId, locationId);

  if (!location) {
    return null;
  }

  return (
    <UnderlinedMsg
      id={localMessageIds.locationSelect.location}
      values={{
        location: <UnderlinedText text={location.title} />,
      }}
    />
  );
};

export default UnderlinedLocationTitle;
