import AllMembers from '../AllMembers';
import { ZetkinView } from '../../../../../../../src/types/zetkin';

const Suggested: ZetkinView[] = [
    AllMembers,
    {
        ...AllMembers, id: 437523096230947928456424, title: 'Most active members',
    },
    {
        ...AllMembers, id: 245350101826245968892345, title: 'Newest members',
    }];

export default Suggested;
