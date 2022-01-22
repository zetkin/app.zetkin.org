import { GridRenderCellParams } from '@mui/x-data-grid-pro';
import PersonNotesViewCell from './PersonNotesViewCell';
import { render } from 'utils/testing';

const personNotes = [
    { created: '1989-07-05', id: 1, text: 'First note'  },
    { created: '2021-07-05', id: 3, text: 'Third note' },
    { created: '1857-07-05', id: 2, text: 'Second note' },
];

describe('PersonNotesViewCell', () => {
    const mockParams = (overrides?: Partial<GridRenderCellParams>) => {
        return {
            field: 'fieldName',
            value: null,
            ...overrides,
        } as GridRenderCellParams;
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
            row: {
                fieldName: [],
            },
        });
        const { baseElement } = render(
            <PersonNotesViewCell params={ params }/>,
        );
        expect(baseElement.innerHTML).toEqual('<div></div>');
    });

    it('renders most recent note when there are more than one', () => {
        const params = mockParams({
            row: {
                fieldName: personNotes,
            },
        });
        const { getByText } = render(
            <PersonNotesViewCell params={ params }/>,
        );

        getByText('Third note');
    });
});
