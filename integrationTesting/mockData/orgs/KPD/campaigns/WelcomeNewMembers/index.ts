import KPD from '../..';
import RosaLuxemburg from '../../people/RosaLuxemburg';
import { ZetkinCampaign } from 'utils/types/zetkin';

/**
 * A base campaign
 *
 * - Rosa Luxemburg manager
 * - Public
 * - Published
 */
const WelcomeNewMembers: ZetkinCampaign = {
  color: '',
  id: 2,
  info_text: `Welcome new members to the KPD to make sure they are aware of the org
    structure, upcoming and recurring events, and the processes of democratic participation.`,
  manager: {
    id: RosaLuxemburg.id,
    name: RosaLuxemburg.first_name + ' ' + RosaLuxemburg.last_name,
  },
  organization: KPD,
  published: true,
  title: 'Welcome new members',
  visibility: 'public',
};

export default WelcomeNewMembers;
