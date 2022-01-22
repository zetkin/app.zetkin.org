import { mockObject } from '.';
import { COLUMN_TYPE, ZetkinViewColumn } from 'types/views';


const viewCol: ZetkinViewColumn = {
    config: {},
    description: 'This is not a real column',
    id: 1,
    title: 'Mock column',
    type: COLUMN_TYPE.LOCAL_BOOL,
};

const mockViewCol = (overrides?: Partial<ZetkinViewColumn>): ZetkinViewColumn => {
    return mockObject<ZetkinViewColumn>(viewCol, overrides);
};

export default mockViewCol;
