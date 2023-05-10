import { FC } from 'react';

import messageIds from '../l10n/messageIds';
import { useMessages } from 'core/i18n';

interface LocationNameProps {
  location: {
    id: number;
    lat: number;
    lng: number;
    title: string;
  } | null;
}

const LocationName: FC<LocationNameProps> = ({ location }) => {
  const messages = useMessages(messageIds);
  if (!location) {
    return <>{messages.common.noLocation()}</>;
  }
  return <>{location.title}</>;
};

export default LocationName;
