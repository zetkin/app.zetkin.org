import ClarasOnboarding from '.';
import ClaraZetkin from '../../../../people/ClaraZetkin';
import KPD from '../../../..';
import {
  UPDATE_TYPES,
  ZetkinUpdate,
  ZetkinUpdateJourneyInstanceAddNote,
} from '../../../../../../../../src/types/updates';

export const NoteUpdate: ZetkinUpdateJourneyInstanceAddNote = {
  actor: {
    first_name: ClaraZetkin.first_name,
    id: ClaraZetkin.id,
    last_name: ClaraZetkin.last_name,
  },
  details: {
    note: { files: [], id: 1, text: 'The sea was angry that day my friends' },
  },
  organization: KPD,
  target: ClarasOnboarding,
  timestamp: '2022-06-20T00:00:00',
  type: UPDATE_TYPES.JOURNEYINSTANCE_ADDNOTE,
};

const ClarasOnboardingTimelineUpdates: ZetkinUpdate[] = [NoteUpdate];

export default ClarasOnboardingTimelineUpdates;
