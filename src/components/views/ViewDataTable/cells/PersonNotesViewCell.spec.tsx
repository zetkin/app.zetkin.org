import { render } from 'test-utils';

import PersonNotesViewCell, { PersonNotesViewCellParams } from './PersonNotesViewCell';


describe('PersonNotesViewCell', () => {
    const mockParams = (overrides?: Partial<PersonNotesViewCellParams>) => {
        return {
            value: null,
            ...overrides,
        } as PersonNotesViewCellParams;
    };

    it('renders empty when content is null', () => {
        const params = mockParams();
        const { baseElement } = render(
            <PersonNotesViewCell params={ params }/>,
        );
        expect(baseElement.innerHTML).toEqual('<div></div>');
    });

    it('renders empty when content is empty', () => {
        const params = mockParams({
            value: [],
        });
        const { baseElement } = render(
            <PersonNotesViewCell params={ params }/>,
        );
        expect(baseElement.innerHTML).toEqual('<div></div>');
    });

    it('renders most recent note when there are more than one', () => {
        const params = mockParams({
            value: [
                { created: '1989-07-05', id: 1, text: 'First note'  },
                { created: '2021-07-05', id: 3, text: 'Third note' },
                { created: '1857-07-05', id: 2, text: 'Second note' },
            ],
        });
        const { getByText } = render(
            <PersonNotesViewCell params={ params }/>,
        );

        getByText('Third note');
    });
});
