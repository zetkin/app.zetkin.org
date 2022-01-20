import { GridRenderCellParams, GridStateColDef } from '@mui/x-data-grid-pro';

import LocalPersonViewCell  from './LocalPersonViewCell';
import { render } from 'utils/testing';
import { ZetkinPerson } from 'types/zetkin';


describe('LocalPersonViewCell', () => {
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
            <LocalPersonViewCell orgId="1" params={ params }/>,
        );
        expect(baseElement.innerHTML).toEqual('<div></div>');
    });

    it('renders only avatar when narrow', () => {
        const params = mockParams({
            colDef: {
                width: 50,
            } as unknown as GridStateColDef,
            row: {
                fieldName: {
                    first_name: 'Jerry',
                    id: 123,
                    last_name: 'Seinfeld',
                } as ZetkinPerson,
            },
        });

        const { queryByText, baseElement } = render(
            <LocalPersonViewCell orgId="1" params={ params }/>,
        );

        const img = baseElement.querySelector('img') as HTMLImageElement;

        expect(img).not.toBeNull();
        expect(img.getAttribute('src')).toBe('/api/orgs/1/people/123/avatar');
        expect(queryByText('Jerry Seinfeld')).toBeNull();
    });

    it('renders avatar and name when wide', () => {
        const params = mockParams({
            colDef: {
                width: 150,
            } as unknown as GridStateColDef,
            row: {
                fieldName: {
                    first_name: 'Jerry',
                    id: 123,
                    last_name: 'Seinfeld',
                } as ZetkinPerson,
            },
        });

        const { queryByText, baseElement } = render(
            <LocalPersonViewCell orgId="1" params={ params }/>,
        );

        const img = baseElement.querySelector('img');

        expect(img).not.toBeNull();
        expect(queryByText('Jerry Seinfeld')).not.toBeNull();
    });
});
