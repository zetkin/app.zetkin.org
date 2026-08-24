import KPD from '..';
import { ZetkinLocation } from 'features/areaAssignments/types';

const SmokeLocation: ZetkinLocation = {
  created: '2020-01-01T00:00:00+00:00',
  created_by_user_id: null,
  description: '',
  id: 1,
  latitude: 52.505,
  longitude: 13.375,
  num_estimated_households: 0,
  num_households_successful: null,
  num_households_visited: null,
  num_known_households: 0,
  num_successful_visits: 0,
  num_visits: 0,
  organization_id: KPD.id,
  title: 'Smoke location',
  type: 'assignment',
};

export default SmokeLocation;
