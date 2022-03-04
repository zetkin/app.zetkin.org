import { mockObject } from '.';
import { PersonNote } from 'components/views/ViewDataTable/cells/PersonNotesViewCell';

const personNote: PersonNote = {
  created: new Date().toISOString(),
  id: 1,
  text: 'person note text',
};

const mockPersonNote = (overrides?: Partial<PersonNote>): PersonNote => {
  return mockObject<PersonNote>(personNote, overrides);
};

export default mockPersonNote;
