import { mockObject } from 'utils/testing/mocks';
import { ZetkinNote } from 'types/zetkin';

const note: ZetkinNote = {
  id: 1,
  text: JSON.stringify([
    {
      children: [{ text: 'Note to self' }],
      type: 'paragraph',
    },
  ]),
};

const mockNote = (overrides?: Partial<ZetkinNote>): ZetkinNote => {
  return mockObject(note, overrides);
};

export default mockNote;

export { note };
