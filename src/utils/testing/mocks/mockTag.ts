import { mockObject } from 'utils/testing/mocks';
import mockOrganization from './mockOrganization';
import {
  ZetkinAppliedTag,
  ZetkinTag,
  ZetkinTagGroup,
} from 'utils/types/zetkin';

interface MockTag extends Partial<Omit<ZetkinAppliedTag, 'group'>> {
  group?: Partial<ZetkinTagGroup> | null;
}

const tag: ZetkinAppliedTag = {
  color: null,
  description: 'People who organize',
  group: null,
  hidden: false,
  id: 1,
  organization: mockOrganization(),
  title: 'Organizer',
  value: null,
  value_type: null,
};

const defaultGroup: ZetkinTagGroup = mockObject({
  id: 1,
  organization: mockOrganization(),
  title: 'Political',
});

export const mockAppliedTag = (
  overrides?: Partial<MockTag>
): ZetkinAppliedTag => {
  if (overrides && 'group' in overrides && overrides.group) {
    const group = mockObject(defaultGroup, overrides.group);
    return mockObject(tag, { ...overrides, group });
  }
  return mockObject(tag, overrides as ZetkinAppliedTag);
};

const mockTag = (overrides?: Partial<MockTag>): ZetkinTag => {
  if (overrides && 'group' in overrides && overrides.group) {
    const group = mockObject(defaultGroup, overrides.group);
    return mockObject(tag, { ...overrides, group });
  }
  return mockObject(tag, overrides as ZetkinTag);
};

export default mockTag;

export { tag };
