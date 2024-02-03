import KPD from '../../..';
import RosaLuxemburg from '../../RosaLuxemburg';
import { ZetkinView } from 'utils/types/zetkin';

const NewView: ZetkinView = {
  content_query: null,
  created: '2021-11-21T12:53:15',
  description: '',
  folder: null,
  id: 2,
  organization: KPD,
  owner: {
    id: RosaLuxemburg.id,
    name: RosaLuxemburg.first_name + ' ' + RosaLuxemburg.last_name,
  },
  title: 'New View',
};

export default NewView;
