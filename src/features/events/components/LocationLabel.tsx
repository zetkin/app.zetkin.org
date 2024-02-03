import { FC } from 'react';

import messageIds from '../l10n/messageIds';
import { useMessages } from 'core/i18n';

interface LocationLabelProps {
  location: {
    id: number;
    lat: number;
    lng: number;
    title: string;
  } | null;
}

const LocationLabel: FC<LocationLabelProps> = ({ location }) => {
  const messages = useMessages(messageIds);
  if (!location) {
    return <>{messages.common.noLocation()}</>;
  }
  return <span>{location.title}</span>;
};

export default LocationLabel;
