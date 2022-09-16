import KPD from '../..';
import { ZetkinCampaign } from 'utils/types/zetkin';

/**
 * A base campaign
 *
 * - No assigned manager
 * - Private
 * - Published
 */
const ReferendumSignatureCollection: ZetkinCampaign = {
  color: '',
  id: 1,
  info_text: `20,000 signatures are needed to put the motion to expropriate mega landlords the people of Berlin.`,
  manager: null,
  organization: KPD,
  published: true,
  title: 'Deutsche Wohnen Enteignen Signatures Collection',
  visibility: 'private',
};

export default ReferendumSignatureCollection;
