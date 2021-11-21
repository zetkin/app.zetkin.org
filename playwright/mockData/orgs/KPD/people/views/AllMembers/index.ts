import KPD from '../../..';
import RosaLuxemburg from '../../../../../users/RosaLuxemburg';
import { ZetkinView } from '../../../../../../../src/types/zetkin';

const AllMembers: ZetkinView = {
    created: '2021-11-21T12:53:15',
    description: 'All members in the KPD',
    id: 1,
    organization: KPD,
    owner: {
        id: RosaLuxemburg.id,
        name: RosaLuxemburg.first_name + ' ' + RosaLuxemburg.last_name,
    },
    title: 'All KPD members',
};

export default AllMembers;
