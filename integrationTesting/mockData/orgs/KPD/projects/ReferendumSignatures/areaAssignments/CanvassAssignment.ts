import KPD from '../../..';
import ReferendumSignatureCollection from '..';
import { ZetkinAreaAssignment } from 'features/areaAssignments/types';

const CanvassAssignment: ZetkinAreaAssignment = {
  end_date: null,
  id: 1,
  instructions: '',
  organization_id: KPD.id,
  project_id: ReferendumSignatureCollection.id,
  reporting_level: 'location',
  start_date: '2020-01-01',
  title: 'Canvass assignment',
};

export default CanvassAssignment;
