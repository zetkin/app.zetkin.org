import { mockObject } from 'utils/testing/mocks';
import { ZetkinNote } from 'types/zetkin';

const note: ZetkinNote = {
  id: 1,
  text: '**Some bold markdown!**',
};

const mockNote = (overrides?: Partial<ZetkinNote>): ZetkinNote => {
  return mockObject(note, overrides);
};

export default mockNote;

export { note };
