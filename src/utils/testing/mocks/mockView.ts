import { mockObject } from 'utils/testing/mocks';
import { ZetkinView } from 'types/zetkin';

const view: ZetkinView = {
    content_query: null,
    created: '2021-12-16T14:00:00+00:00',
    description: 'A random description of this random view',
    id: 1,
    organization: {
        id: 1,
        title: 'A ',
    },
    owner: {
        id: 1,
        name: 'M. E. Retsrof',
    },
    title: 'A view with a room',
};


const mockView = (overrides?: Partial<ZetkinView>): ZetkinView => {
    return mockObject(view, overrides);
};

export default mockView;

export { view };
