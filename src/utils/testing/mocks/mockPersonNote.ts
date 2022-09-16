import { mockObject } from '.';
import { PersonNote } from 'features/views/components/ViewDataTable/cells/PersonNotesViewCell';

const personNote: PersonNote = {
  created: new Date().toISOString(),
  id: 1,
  text: 'Person note text.',
};

const mockPersonNote = (overrides?: Partial<PersonNote>): PersonNote => {
  return mockObject<PersonNote>(personNote, overrides);
};

export default mockPersonNote;
