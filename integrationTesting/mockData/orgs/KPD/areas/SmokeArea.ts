import KPD from '..';
import {
  asLatitude,
  asLongitude,
} from 'features/areas/utils/asLongitudeLatitude';
import { Zetkin2Area } from 'features/areas/types';

const SmokeArea: Zetkin2Area = {
  boundary: {
    coordinates: [
      [
        [asLongitude(13.37), asLatitude(52.5)],
        [asLongitude(13.38), asLatitude(52.5)],
        [asLongitude(13.38), asLatitude(52.51)],
        [asLongitude(13.37), asLatitude(52.51)],
        [asLongitude(13.37), asLatitude(52.5)],
      ],
    ],
    type: 'Polygon',
  },
  description: '',
  id: 1,
  organization_id: KPD.id,
  title: 'Smoke area',
};

export default SmokeArea;
