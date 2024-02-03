import { mockObject } from 'utils/testing/mocks';
import { ZetkinNote } from 'utils/types/zetkin';

const note: ZetkinNote = {
  files: [],
  id: 1,
  text: '**Some bold markdown!**',
};

const mockNote = (overrides?: Partial<ZetkinNote>): ZetkinNote => {
  return mockObject(note, overrides);
};

export default mockNote;

export { note };
