import { mockObject } from 'utils/testing/mocks';
import mockOrganization from './mockOrganization';
import { ZetkinView } from 'utils/types/zetkin';

const view: ZetkinView = {
  content_query: null,
  created: '2021-12-16T14:00:00+00:00',
  description: 'A random description of this random view',
  folder: null,
  id: 1,
  organization: mockOrganization(),
  owner: {
    id: 1,
    name: 'Clara Zetkin',
  },
  title: 'A view with a room',
};

const mockView = (overrides?: Partial<ZetkinView>): ZetkinView => {
  return mockObject(view, overrides);
};

export default mockView;

export { view };
