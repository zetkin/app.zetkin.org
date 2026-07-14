import KPD from '../..';
import RosaLuxemburg from '../../people/RosaLuxemburg';
import { ZetkinProject } from 'utils/types/zetkin';

/**
 * A base project
 *
 * - Rosa Luxemburg manager
 * - Public
 * - Published
 */
const WelcomeNewMembers: ZetkinProject = {
  archived: false,
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
  visibility: 'open',
};

export default WelcomeNewMembers;
