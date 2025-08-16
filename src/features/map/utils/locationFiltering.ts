import { IntlShape } from 'react-intl';

import { injectIntl } from 'core/i18n/useMessages';
import messageIds from 'features/events/l10n/messageIds';

export function getLocationLabel(
  geojson: Array<GeoJSON.Feature>,
  intl: IntlShape
) {
  // Need decision on how to handle multiple locations and unnamed locations to do this properly.
  const commonMessages = injectIntl(messageIds.common, intl);
  let locationTitle = commonMessages.noLocation();

  if (geojson.length > 1) {
    locationTitle = geojson[0]?.properties?.location?.title + ' + ...';
  } else if (geojson.length === 1) {
    locationTitle = geojson[0]?.properties?.location?.title;
  }
  return locationTitle;
}

export function isLocationInGeoJSONFeatures(
  location: { lat: number; lng: number } | null,
  geojson: Array<GeoJSON.Feature> = []
) {
  if (!location || !geojson.length) {
    return false;
  }

  return (
    -1 !==
    geojson.findIndex((filterLoc) => {
      return (
        filterLoc?.properties?.location.lat === location?.lat &&
        filterLoc?.properties?.location.lng === location?.lng
      );
    })
  );
}
