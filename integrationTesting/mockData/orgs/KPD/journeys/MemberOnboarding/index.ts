import KPD from '../..';
import { ZetkinJourney } from 'utils/types/zetkin';

const MemberOnboarding: ZetkinJourney = {
  id: 1,
  opening_note_template: '',
  organization: KPD,
  plural_label: 'Onboardings',
  singular_label: 'Onboarding',
  stats: {
    closed: 1983,
    open: 232,
  },
  title: 'Member Onboarding',
};

export default MemberOnboarding;
