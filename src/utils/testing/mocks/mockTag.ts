import { mockObject } from 'utils/testing/mocks';
import { ZetkinTag } from 'types/zetkin';

const tag: ZetkinTag = {
  color: null,
  description: 'People who organize',
  group: null,
  hidden: false,
  id: 1,
  organization: {
    id: 1,
    title: 'KPD',
  },
  title: 'Organizer',
};

const mockTag = (overrides?: Partial<ZetkinTag>): ZetkinTag => {
  return mockObject(tag, overrides);
};

export default mockTag;

export { tag };
