import { makeGridColDef } from './utils';
import { COLUMN_TYPE, ZetkinViewColumn } from 'types/views';


describe('makeGridColDef', () => {
    const mockViewCol = (overrides?: Partial<ZetkinViewColumn>) => {
        return {
            config: {},
            description: 'This is not a real column',
            id: 1,
            title: 'Mock column',
            type: COLUMN_TYPE.LOCAL_BOOL,
            ...overrides,
        } as ZetkinViewColumn;
    };

    it('returns common fields correctly', () => {
        const colMock = mockViewCol();
        const colDef = makeGridColDef(colMock);
        expect(colDef.field).toBe(`col_${colMock.id}`);
        expect(colDef.headerName).toBe(colMock.title);
        expect(colDef.resizable).toBeTruthy();
        expect(colDef.sortable).toBeTruthy();
    });

    it('returns basic default (text) for person_field columns', () => {
        const colDef = makeGridColDef(mockViewCol({
            config: { field: 'first_name' },
            type: COLUMN_TYPE.PERSON_FIELD,
        }));

        expect(colDef.minWidth).toBeGreaterThan(50);
        expect(colDef.width).toEqual(150);
    });
});
