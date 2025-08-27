export function getGeoJSONFeaturesAtLocations(
  geojson: Array<GeoJSON.Feature> = [],
  ...locations: { id: number; lat: number; lng: number }[]
) {
  if (!geojson.length || !locations.length) {
    return [];
  }

  return geojson.filter((geojsonLocation) => {
    return !!locations.find((location) => {
      return geojsonLocation?.properties?.location?.id === location?.id;
    });
  });
}
