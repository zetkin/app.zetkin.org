import { mockObject } from 'utils/testing/mocks';
import mockOrganization from './mockOrganization';
import { ZetkinTag, ZetkinTagGroup } from 'utils/types/zetkin';

interface MockTag extends Partial<Omit<ZetkinTag, 'group'>> {
  group?: Partial<ZetkinTagGroup> | null;
}

const tag: ZetkinTag = {
  color: null,
  description: 'People who organize',
  group: null,
  hidden: false,
  id: 1,
  organization: mockOrganization(),
  title: 'Organizer',
  value_type: null,
};

const defaultGroup: ZetkinTagGroup = mockObject({
  id: 1,
  organization: mockOrganization(),
  title: 'Political',
});

const mockTag = (overrides?: Partial<MockTag>): ZetkinTag => {
  if (overrides && 'group' in overrides && overrides.group) {
    const group = mockObject(defaultGroup, overrides.group);
    return mockObject(tag, { ...overrides, group });
  }
  return mockObject(tag, overrides as ZetkinTag);
};

export default mockTag;

export { tag };
