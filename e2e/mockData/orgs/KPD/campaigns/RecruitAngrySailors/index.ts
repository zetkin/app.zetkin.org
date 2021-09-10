import KPD from '../..';
import { ZetkinCampaign } from '../../../../../../src/types/zetkin';

/**
 * A base campaign
 *
 * - No assigned manager
 * - Private
 * - Published
 */
const RecruitAngrySailors: ZetkinCampaign = {
    color: 'red',
    id: 1,
    info_text: `Sailors returning from WW1 are angry that they have not been paid, 
    and that they have been so mistreated by the Kaiser. They are prime recruits for the upcoming
    revolution.`,
    manager: null,
    organization: KPD,
    published: true,
    title: 'Recruit angry sailors returning from war',
    visibility: 'private',
};

export default RecruitAngrySailors;
